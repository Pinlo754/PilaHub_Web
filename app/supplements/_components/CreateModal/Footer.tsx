import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  step: "info" | "ingredients" | "purposes";
  isSubmitting: boolean;
  uploading: boolean;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export const Footer = ({
  step,
  isSubmitting,
  uploading,
  onCancel,
  onBack,
  onNext,
  onSubmit,
}: Props) => (
  <div className="flex gap-2 justify-end">
    <Button variant="outline" onClick={onCancel}>
      Huỷ
    </Button>
    {step !== "info" && (
      <Button variant="outline" onClick={onBack}>
        Quay lại
      </Button>
    )}
    {step !== "purposes" ? (
      <Button
        onClick={onNext}
        variant="outline"
        className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700"
      >
        Tiếp theo
      </Button>
    ) : (
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || uploading}
        variant="outline"
        className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Đang lưu...
          </span>
        ) : (
          "Thêm mới"
        )}
      </Button>
    )}
  </div>
);
