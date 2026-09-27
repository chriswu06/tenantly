import type { NextRequest } from "next/server";
import { getAdvocate } from "@/lib/auth";
import { listAllLookups } from "@/lib/cases/queries";
import { csvResponse, csvRow } from "../../csv";

/** "Export CSV" on License lookups. `?filter=failed` exports failed lookups only. */
export async function GET(request: NextRequest) {
  if (!(await getAdvocate())) return new Response("Sign in to export lookups.", { status: 401 });

  const failedOnly = request.nextUrl.searchParams.get("filter") === "failed";
  const lookups = await listAllLookups({ failedOnly });
  const rows = [
    csvRow(["Checked at", "Address", "Result", "Response (ms)", "Method", "Error", "Case"]),
    ...lookups.map((l) => csvRow([l.checkedAt, l.address, l.result, l.responseMs, l.method, l.error, l.reference])),
  ];
  const name = failedOnly ? "failed-license-lookups" : "license-lookups";
  return csvResponse(`${name}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}
