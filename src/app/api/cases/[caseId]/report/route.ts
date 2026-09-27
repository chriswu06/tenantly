import { getAdvocate } from "@/lib/auth";
import { getCaseDetail } from "@/lib/cases/queries";
import { getTenantCase } from "@/lib/cases/session";
import { getTenantView } from "@/lib/cases/tenant";
import { renderAdvocateReport, renderTenantReport } from "@/lib/reports/case-report";

const notFound = () => new Response("Report not found", { status: 404 });

/**
 * GET /api/cases/:reference/report?type=summary|checklist|case → PDF download.
 * summary and checklist: only for the browser that owns the case (its cookie).
 * case: only for a signed-in advocate whose organization can see the case.
 */
export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId: reference } = await params;
  const type = new URL(request.url).searchParams.get("type") ?? "summary";

  let report: { buffer: Buffer; filename: string } | null = null;
  if (type === "case") {
    if (!(await getAdvocate())) return notFound();
    // getCaseDetail throws notFound() when row-level security hides the case.
    const found = await getCaseDetail(reference).catch(() => null);
    if (!found) return notFound();
    report = await renderAdvocateReport(found.caseData, found.detail);
  } else {
    const row = await getTenantCase();
    if (!row || row.reference !== reference) return notFound();
    report = await renderTenantReport(await getTenantView(), type);
  }
  if (!report) return notFound();

  return new Response(new Uint8Array(report.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${report.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
