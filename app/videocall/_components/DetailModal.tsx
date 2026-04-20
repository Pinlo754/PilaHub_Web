"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CoachBookingType } from "@/utils/CoachBookingType";
import { getBookingStatusConfig, getBookingTypeConfig } from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: CoachBookingType | null;
  onMarkReady: (bookingId: string) => void;
};

const DetailModal = ({ open, onOpenChange, booking, onMarkReady }: Props) => {
  if (!booking) return null;

  const statusConfig = getBookingStatusConfig(booking.status);
  const typeConfig = getBookingTypeConfig(booking.bookingType);

  const handleMarkReady = () => {
    onMarkReady(booking.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết đặt lịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Status & Type badges */}
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.label}
            </span>
            <span
              className={`px-3 py-1 rounded-full font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
            >
              {typeConfig.label}
            </span>
          </div>

          <div className="border rounded-xl divide-y divide-gray-100">
            <Row label="Mã đặt lịch" value={booking.id} />
            <Row label="Học viên" value={booking.trainee.fullName} />
            <Row label="HLV" value={booking.coach.fullName} />
            <Row
              label="Thời gian bắt đầu"
              value={formatLocalDateTime(booking.startTime)}
            />
            <Row
              label="Thời gian kết thúc"
              value={formatLocalDateTime(booking.endTime)}
            />
            <Row label="Giá / giờ" value={formatVND(booking.pricePerHour)} />
            <Row label="Tổng tiền" value={formatVND(booking.totalAmount)} />
            <Row
              label="Ngày tạo"
              value={formatLocalDateTime(booking.createdAt)}
            />
          </div>

          {booking.personalSchedule && (
            <div className="border rounded-xl p-3 bg-orange-50 space-y-1">
              <p className="font-semibold text-orange-700">
                Lịch cá nhân đính kèm
              </p>
              <p className="text-gray-600">
                Tên: {booking.personalSchedule.scheduleName}
              </p>
              <p className="text-gray-500">
                Mô tả: {booking.personalSchedule.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={handleMarkReady}
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700"
          >
            Chuyển trạng thái
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between px-4 py-2">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-700 font-medium text-right max-w-[60%] break-all">
      {value}
    </span>
  </div>
);

export default DetailModal;
