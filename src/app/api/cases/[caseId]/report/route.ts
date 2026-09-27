import { renderCaseReport } from "@/lib/reports/case-report";

/** GET /api/cases/:caseId/report?type=summary|checklist|case[&result=unverified] → PDF download. */
export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const { searchParams } = new URL(request.url);
  const report = await renderCaseReport(caseId, searchParams.get("type") ?? "summary", {
    unverified: searchParams.get("result") === "unverified",
  });
  if (!report) return new Response("Report not found", { status: 404 });

  return new Response(new Uint8Array(report.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${report.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
