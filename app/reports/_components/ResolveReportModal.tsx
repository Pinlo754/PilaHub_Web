"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LiveSessionReportType } from "@/utils/LiveSessionReportType";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: LiveSessionReportType | null;
  onSubmit: (liveSessionId: string, internalNote: string) => void;
};

const ResolveReportModal = ({
  open,
  onOpenChange,
  report,
  onSubmit,
}: Props) => {
  const [internalNote, setInternalNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!internalNote.trim()) {
      setError("Ghi chú nội bộ không được để trống");
      return;
    }
    if (!report) return;
    onSubmit(report.liveSessionId, internalNote.trim());
    setInternalNote("");
    setError("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setInternalNote("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Xử lý báo cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Nhập ghi chú nội bộ để hoàn tất xử lý báo cáo này.
          </p>

          <div className="space-y-2">
            <Label className="">Ghi chú nội bộ</Label>
            <textarea
              value={internalNote}
              onChange={(e) => {
                setInternalNote(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              placeholder="Nhập ghi chú xử lý..."
              className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            Xác nhận xử lý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveReportModal;
