import { LiveSessionReportType } from "@/utils/LiveSessionReportType";
import { TraineeType } from "@/utils/TraineeType";
import { CoachType } from "@/utils/CoachType";
import LiveSessionReportRow from "./LiveSessionReportRow";

type Props = {
  reports: LiveSessionReportType[];
  traineeMap: Record<string, TraineeType>;
  coachMap: Record<string, CoachType>;
  onPressReport: (report: LiveSessionReportType) => void;
  onResolve: (report: LiveSessionReportType) => void;
};

const LiveSessionReportTable = ({
  reports,
  traineeMap,
  coachMap,
  onPressReport,
  onResolve,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã buổi học
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Học viên báo cáo
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            HLV bị báo cáo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Lý do
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {reports.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-gray-400">
              Không có báo cáo nào
            </td>
          </tr>
        ) : (
          reports.map((report) => (
            <LiveSessionReportRow
              key={report.liveSessionId}
              report={report}
              trainee={traineeMap[report.reporterId] ?? null}
              coach={coachMap[report.reportedUserId] ?? null}
              onPressReport={onPressReport}
              onResolve={onResolve}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default LiveSessionReportTable;
