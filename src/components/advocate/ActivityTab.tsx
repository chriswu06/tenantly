import type { CaseDetailData } from "@/lib/cases/queries";
import { ActivityPanel } from "./CaseDetail";

/** Activity tab on mobile: the case timeline. */
export function ActivityTab({ detail }: { detail: CaseDetailData }) {
  return (
    <div className="lg:hidden">
      <ActivityPanel events={detail.activity} />
    </div>
  );
}
