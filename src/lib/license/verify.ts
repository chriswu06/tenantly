import "server-only";

/*
 * License lookup, behind one interface so a real DHCD data feed can replace the
 * guided check without touching pages.
 *
 * Today there is no automatic source. Baltimore City's public ArcGIS "Licenses"
 * table holds liquor licenses, and the DHCD registration layer has only a few
 * hundred rows. The authoritative data is DHCD's OpenGov Rental License Look-Up,
 * which blocks automated access. So lookups report "unavailable" and the tenant
 * is sent to the guided check (/verify/guided-check).
 */

export type LicenseRecord = {
  licenseNumber: string;
  status: "active" | "expired";
  validFrom: string | null;
  validTo: string | null;
  source: string;
};

export type LicenseLookup =
  | { status: "found"; result: "no_license" | "expired" | "active"; records: LicenseRecord[]; source: string; responseMs: number }
  | { status: "unavailable"; reason: string };

export interface LicenseProvider {
  name: string;
  lookup(address: { normalized: string; filingDate: string | null }): Promise<LicenseLookup>;
}

const unavailable: LicenseProvider = {
  name: "none",
  async lookup() {
    return { status: "unavailable", reason: "Baltimore City doesn’t publish rental license data for automatic lookups." };
  },
};

export const licenseProvider: LicenseProvider = unavailable;
