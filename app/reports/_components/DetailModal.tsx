// _components/DetailModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LiveSessionReportType } from "@/utils/LiveSessionReportType";
import { LiveSessionType } from "@/utils/LiveSessionType";
import { TraineeType } from "@/utils/TraineeType";
import { CoachType } from "@/utils/CoachType";
import { AccountType } from "@/utils/AccountType";
import { getReportReasonConfig } from "@/utils/uiMapper";
import { LiveSessionService } from "@/hooks/liveSession.service";
import { useEffect, useState } from "react";
import { Video, VideoOff, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: LiveSessionReportType | null;
  trainee: TraineeType | null;
  coach: CoachType | null;
  resolverMap: Record<string, AccountType>;
  onResolve: (report: LiveSessionReportType) => void;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between px-4 py-2">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-700 font-medium text-right max-w-[60%] break-all">
      {value}
    </span>
  </div>
);

const PersonCell = ({
  label,
  name,
  avatarUrl,
}: {
  label: string;
  name: string;
  avatarUrl?: string;
}) => (
  <div className="flex justify-between items-center px-4 py-2">
    <span className="text-gray-500 shrink-0">{label}</span>
    <div className="flex items-center gap-2">
      <img
        src={avatarUrl || "/default-logo.png"}
        alt={name}
        className="w-7 h-7 rounded-full object-cover border"
      />
      <span className="text-gray-700 font-medium">{name}</span>
    </div>
  </div>
);

const DetailModal = ({
  open,
  onOpenChange,
  report,
  trainee,
  coach,
  onResolve,
  resolverMap,
}: Props) => {
  const [liveSession, setLiveSession] = useState<LiveSessionType | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isFetchingSession, setIsFetchingSession] = useState(false);

  useEffect(() => {
    if (!open || !report) return;

    const fetchData = async () => {
      setIsFetchingSession(true);
      setLiveSession(null);
      setRecordingUrl(null);

      try {
        // 1. Fetch session trước
        const session = await LiveSessionService.getById(report.liveSessionId);
        setLiveSession(session);

        // 2. Check expire
        const isExpired =
          session.recordingExpiresAt &&
          new Date(session.recordingExpiresAt) < new Date();

        // 3. Nếu chưa hết hạn → fetch record URL
        if (!isExpired) {
          const url = await LiveSessionService.getRecordUrl(
            report.liveSessionId,
          );
          setRecordingUrl(url);
        }
      } catch (err) {
        // có thể log nếu cần
        console.error(err);
      } finally {
        setIsFetchingSession(false);
      }
    };

    fetchData();
  }, [open, report?.liveSessionId]);

  if (!report) return null;

  const reasonConfig = getReportReasonConfig(report.reason);
  const isResolved = !!report.resolvedAt;
  const resolver = report.resolvedBy ? resolverMap[report.resolvedBy] : null;

  const isExpired =
    liveSession?.recordingExpiresAt &&
    new Date(liveSession.recordingExpiresAt) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết báo cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Status Badge */}
          <div className="flex justify-end">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                isResolved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isResolved ? "Đã xử lý" : "Chờ xử lý"}
            </span>
          </div>

          {/* Info Table */}
          <div className="border rounded-xl divide-y divide-gray-100">
            <Row label="Mã buổi học" value={report.liveSessionId} />
            <PersonCell
              label="Học viên báo cáo"
              name={trainee?.fullName ?? report.reporterId}
              avatarUrl={trainee?.avatarUrl}
            />
            <PersonCell
              label="HLV bị báo cáo"
              name={coach?.fullName ?? report.reportedUserId}
              avatarUrl={coach?.avatarUrl}
            />
            <Row label="Lý do" value={reasonConfig.label} />
            <Row
              label="Ngày tạo"
              value={new Date(report.createdAt).toLocaleString("vi-VN")}
            />
            {report.resolvedAt && (
              <Row
                label="Ngày xử lý"
                value={new Date(report.resolvedAt).toLocaleString("vi-VN")}
              />
            )}
            {report.resolvedBy && (
              <Row
                label="Xử lý bởi"
                value={resolver?.email ?? report.resolvedBy}
              />
            )}
          </div>

          {/* Description */}
          {report.description && (
            <div className="border rounded-xl p-4 bg-gray-50 space-y-1">
              <p className="font-semibold text-gray-600">Mô tả</p>
              <p className="text-gray-500">{report.description}</p>
            </div>
          )}

          {/* Internal Note */}
          {report.internalNote && (
            <div className="border rounded-xl p-4 bg-orange-50 space-y-1">
              <p className="font-semibold text-orange-700">Ghi chú nội bộ</p>
              <p className="text-gray-600">{report.internalNote}</p>
            </div>
          )}

          {/* Recording Video */}
          <div className="border rounded-xl p-4 space-y-3 h-[300px] flex flex-col">
            <p className="font-semibold text-gray-600 flex items-center gap-2">
              <Video size={16} className="text-orange-500" />
              Video buổi học
            </p>

            <div className="flex-1 flex items-center justify-center">
              {isFetchingSession ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang tải video...</span>
                </div>
              ) : isExpired ? (
                <div className="text-gray-400 text-center">
                  <span>Video đã hết hạn</span>
                </div>
              ) : recordingUrl ? (
                <video
                  src={recordingUrl}
                  controls
                  className="h-full w-full rounded-lg border border-orange-100 bg-black"
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <VideoOff size={28} className="text-gray-300" />
                  <span className="text-xs">Không có video ghi lại</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {!isResolved && (
            <Button
              onClick={() => onResolve(report)}
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              Xử lý báo cáo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
