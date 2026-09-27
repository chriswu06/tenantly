import { getAdvocate } from "@/lib/auth";
import { getReports } from "@/lib/cases/queries";
import { csvResponse, csvRow } from "../../csv";

/** "Export report": the impact report's numbers as CSV. */
export async function GET() {
  const advocate = await getAdvocate();
  if (!advocate) return new Response("Sign in to export reports.", { status: 401 });

  const { reportMetrics, checksPerMonth, outcomesLast6Months, range } = await getReports();
  const rows = [
    csvRow(["Standing impact report", advocate.organization.name, range]),
    "",
    csvRow(["Metric", "Value", "Note"]),
    ...reportMetrics.map((m) => csvRow([m.label, m.value, m.note])),
    "",
    csvRow(["Month", "License checks", "No active license found"]),
    ...checksPerMonth.map((m) => csvRow([m.month, m.total, m.noLicense])),
    "",
    csvRow(["Reported outcome", "Count"]),
    ...outcomesLast6Months.map((o) => csvRow([o.label, o.count])),
  ];
  return csvResponse(`standing-impact-report-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}
