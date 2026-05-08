"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TicketRes, TICKET_STATUS } from "@/utils/TicketType";
import { VendorType } from "@/utils/VendorType";
import { formatLocalDateTime } from "@/utils/day";
import { getTicketStatusConfig } from "@/utils/uiMapper";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TicketRes;
  vendor?: VendorType;
  onApprove: (ticketId: string) => void;
  onReject: (ticketId: string) => void;
};

const DetailModal = ({
  open,
  onOpenChange,
  item,
  vendor,
  onApprove,
  onReject,
}: Props) => {
  const statusConfig = getTicketStatusConfig(item.status);
  const isPending = item.status === TICKET_STATUS.Pending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết đơn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Vendor info */}
          {vendor && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              {vendor.logoUrl && (
                <img
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  className="w-10 h-10 rounded-full object-cover border border-orange-200"
                />
              )}
              <div>
                <p className="font-semibold text-gray-700">
                  {vendor.businessName}
                </p>
                <p className="text-gray-400 text-xs">
                  {vendor.phoneNumber} · {vendor.city}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Tiêu đề</span>
              <span className="font-medium text-gray-700 text-right max-w-xs">
                {item.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Loại đơn</span>
              <span className="text-gray-700">{item.ticketTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(item.createdAt)}</span>
            </div>
          </div>

          {item.description && (
            <div className="border-t pt-3">
              <p className="text-gray-500 mb-1">Mô tả</p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isPending ? (
            <>
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => {
                  onReject(item.ticketId);
                  onOpenChange(false);
                }}
              >
                Từ chối
              </Button>
              <Button
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-700"
                onClick={() => {
                  onApprove(item.ticketId);
                  onOpenChange(false);
                }}
              >
                Duyệt
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
