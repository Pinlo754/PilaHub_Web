import { LiveSessionReportType } from "@/utils/LiveSessionReportType";
import { TraineeType } from "@/utils/TraineeType";
import { CoachType } from "@/utils/CoachType";
import { getReportReasonConfig } from "@/utils/uiMapper";
import { CheckCheck } from "lucide-react";

type Props = {
  report: LiveSessionReportType;
  trainee: TraineeType | null;
  coach: CoachType | null;
  onPressReport: (report: LiveSessionReportType) => void;
  onResolve: (report: LiveSessionReportType) => void;
};

const AvatarCell = ({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) => (
  <div className="flex items-center gap-2">
    <img
      src={avatarUrl || "/default-logo.png"}
      alt={name}
      className="w-8 h-8 rounded-full object-cover border shrink-0"
    />
    <span className="text-gray-700">{name}</span>
  </div>
);

const LiveSessionReportRow = ({
  report,
  trainee,
  coach,
  onPressReport,
  onResolve,
}: Props) => {
  const reasonConfig = getReportReasonConfig(report.reason);
  const isResolved = !!report.resolvedAt;
  const shortSessionId = `${report.liveSessionId.slice(0, 6)}...`;

  return (
    <tr
      onClick={() => onPressReport(report)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortSessionId}</td>
      <td className="py-3 px-4">
        <AvatarCell
          name={trainee?.fullName ?? report.reporterId.slice(0, 8) + "..."}
          avatarUrl={trainee?.avatarUrl}
        />
      </td>
      <td className="py-3 px-4">
        <AvatarCell
          name={coach?.fullName ?? report.reportedUserId.slice(0, 8) + "..."}
          avatarUrl={coach?.avatarUrl}
        />
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${reasonConfig.bgColor} ${reasonConfig.textColor}`}
        >
          {reasonConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${isResolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
        >
          {isResolved ? "Đã xử lý" : "Chờ xử lý"}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {new Date(report.createdAt).toLocaleString("vi-VN")}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          disabled={isResolved}
          onClick={(e) => {
            e.stopPropagation();
            onResolve(report);
          }}
          className="p-2 rounded-md transition inline-flex items-center justify-center bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Xử lý báo cáo"
        >
          <CheckCheck size={16} />
        </button>
      </td>
    </tr>
  );
};

export default LiveSessionReportRow;
