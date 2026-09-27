import "server-only";
import { requireEnv } from "@/lib/env";

const GEOCODER = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

export type GeocodeMatch = {
  /** The geocoder's normalized address, e.g. "2417 E Monument St, Baltimore, Maryland, 21205". */
  address: string;
  /** 0–100; below 90 we treat the address as not found. */
  score: number;
  latitude: number;
  longitude: number;
  /** County or independent city, e.g. "Baltimore City" or "Baltimore County". */
  subregion: string | null;
};

/** Best match for a US street address, or null when nothing matches well enough. */
export async function geocodeAddress(address: string): Promise<GeocodeMatch | null> {
  const params = new URLSearchParams({
    SingleLine: address,
    countryCode: "USA",
    maxLocations: "1",
    outFields: "Subregion,Region,Addr_type",
    f: "json",
    token: requireEnv("ARCGIS_API_KEY"),
  });
  const res = await fetch(`${GEOCODER}?${params}`, { signal: AbortSignal.timeout(10_000), cache: "no-store" });
  if (!res.ok) throw new Error(`ArcGIS geocoder returned ${res.status}`);
  const body = (await res.json()) as {
    error?: { message: string };
    candidates?: { address: string; score: number; location: { x: number; y: number }; attributes: Record<string, string> }[];
  };
  if (body.error) throw new Error(`ArcGIS geocoder: ${body.error.message}`);

  const best = body.candidates?.[0];
  if (!best || best.score < 90) return null;
  return {
    address: best.address,
    score: best.score,
    latitude: best.location.y,
    longitude: best.location.x,
    subregion: best.attributes.Subregion || null,
  };
}
