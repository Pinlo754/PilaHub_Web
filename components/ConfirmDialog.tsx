"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Variant = "danger" | "warning" | "info";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  onConfirm: () => void;
};

const VARIANT_STYLE: Record<Variant, string> = {
  danger: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
  warning: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
  info: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  variant = "danger",
  onConfirm,
}: Props) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {title}
          </DialogTitle>
        </DialogHeader>

        {description && (
          <p className="text-sm text-gray-500 -mt-2">{description}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant="outline"
            className={VARIANT_STYLE[variant]}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
