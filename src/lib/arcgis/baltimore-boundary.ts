import "server-only";

// Baltimore City's public boundary layer (no key needed). It also holds Baltimore
// County and three reservoirs, so we check the name of the shape the point is in.
const BOUNDARIES = "https://egisdata.baltimorecity.gov/egis/rest/services/311/ReferenceLayer/MapServer/3/query";

/** The jurisdiction a point falls in ("Baltimore City", "Baltimore County", …), or null outside them all. */
export async function jurisdictionAt(latitude: number, longitude: number): Promise<string | null> {
  const params = new URLSearchParams({
    geometry: `${longitude},${latitude}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "NAME",
    returnGeometry: "false",
    f: "json",
  });
  const res = await fetch(`${BOUNDARIES}?${params}`, {
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Baltimore boundary service returned ${res.status}`);
  const body = (await res.json()) as { features?: { attributes: { NAME: string } }[] };
  return body.features?.[0]?.attributes.NAME ?? null;
}

export async function isInBaltimoreCity(latitude: number, longitude: number) {
  return (await jurisdictionAt(latitude, longitude)) === "Baltimore City";
}
