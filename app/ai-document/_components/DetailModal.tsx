"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AiDocumentType } from "@/utils/AiDocumentType";
import { formatLocalDateTime } from "@/utils/day";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: AiDocumentType;
  onDownload: (fileName: string) => void;
  onDelete: (fileName: string) => void;
};

const STATE_MAP: Record<
  string,
  { label: string; bgColor: string; textColor: string }
> = {
  ACTIVE: {
    label: "Hoạt động",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  PROCESSING: {
    label: "Đang xử lý",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  FAILED: { label: "Lỗi", bgColor: "bg-red-100", textColor: "text-red-700" },
};

const formatBytes = (bytes: string) => {
  const num = parseInt(bytes, 10);
  if (isNaN(num)) return bytes;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500 shrink-0 w-36">{label}</span>
    <span className="text-sm text-gray-800 text-right break-all">{value}</span>
  </div>
);

const DetailModal = ({
  open,
  onOpenChange,
  document,
  onDownload,
  onDelete,
}: Props) => {
  const fileName = document.name.split("/").pop() ?? document.name;
  const stateConfig = STATE_MAP[document.state] ?? {
    label: document.state,
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700 flex items-center gap-2">
            <FileText size={20} />
            Chi tiết tài liệu
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Row label="Tên hiển thị" value={document.displayName || "—"} />
          <Row label="Tên file" value={fileName} />
          <Row label="Loại MIME" value={document.mimeType} />
          <Row label="Kích thước" value={formatBytes(document.sizeBytes)} />
          <Row
            label="Trạng thái"
            value={
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${stateConfig.bgColor} ${stateConfig.textColor}`}
              >
                {stateConfig.label}
              </span>
            }
          />
          <Row
            label="Ngày tạo"
            value={formatLocalDateTime(document.createTime)}
          />
          <Row
            label="Cập nhật"
            value={formatLocalDateTime(document.updateTime)}
          />
          <Row
            label="Hết hạn"
            value={formatLocalDateTime(document.expirationTime)}
          />
          <Row
            label="SHA256"
            value={
              <span className="font-mono text-xs text-gray-500 break-all">
                {document.sha256Hash}
              </span>
            }
          />
        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-auto"
          >
            Đóng
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => onDelete(fileName)}
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
          >
            <Trash2 size={15} className="mr-1.5" />
            Xoá
          </Button> */}
          <Button
            variant="outline"
            onClick={() => onDownload(fileName)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
          >
            <Download size={15} className="mr-1.5" />
            Tải xuống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
