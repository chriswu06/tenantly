import type { CaseDetailData } from "@/lib/mock/advocate";
import { ActivityPanel } from "./CaseDetail";

/** Activity tab on mobile (frame 53): the case timeline. */
export function ActivityTab({ detail }: { detail: CaseDetailData }) {
  return (
    <div className="lg:hidden">
      <ActivityPanel events={detail.activity} />
    </div>
  );
}
