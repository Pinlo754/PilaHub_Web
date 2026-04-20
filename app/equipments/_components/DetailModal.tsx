"use client";

import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EquipmentType, CreateEquipmentReq } from "@/utils/EquipmentType";
import { formatLocalDateTime } from "@/utils/day";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { ImagePlus, LoaderCircle, UploadCloud, X } from "lucide-react";

type Props =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (data: CreateEquipmentReq) => Promise<void>;
      equipment?: undefined;
      onUpdate?: undefined;
    }
  | {
      mode: "detail";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      equipment: EquipmentType;
      onUpdate: (
        id: string,
        data: Partial<CreateEquipmentReq>,
      ) => Promise<void>;
      onSubmit?: undefined;
    };

const EMPTY: CreateEquipmentReq = { name: "", description: "", imageUrl: "" };

const DetailModal = (props: Props) => {
  const { mode, open, onOpenChange } = props;
  const isCreate = mode === "create";

  const initial: CreateEquipmentReq = isCreate
    ? EMPTY
    : {
        name: props.equipment.name,
        description: props.equipment.description,
        imageUrl: props.equipment.imageUrl,
      };

  const [form, setForm] = useState<CreateEquipmentReq>(initial);
  const [errors, setErrors] = useState<Partial<CreateEquipmentReq>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    isCreate ? null : props.equipment?.imageUrl || null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, loading: isUploading, progress } = useFirebaseUpload();

  // Reset khi mở lại modal
  useEffect(() => {
    if (open) {
      setForm(initial);
      setErrors({});
      setPreviewUrl(isCreate ? null : props.equipment?.imageUrl || null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  // Kiểm tra có thay đổi so với ban đầu không (chỉ cần cho mode detail)
  const isDirty =
    isCreate ||
    form.name !== initial.name ||
    form.description !== initial.description ||
    form.imageUrl !== initial.imageUrl;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateEquipmentReq])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    try {
      const downloadUrl = await uploadFile(file, "equipments");
      setForm((prev) => ({ ...prev, imageUrl: downloadUrl }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Upload ảnh thất bại, vui lòng thử lại",
      }));
      setPreviewUrl(isCreate ? null : props.equipment?.imageUrl || null);
      setForm((prev) => ({ ...prev, imageUrl: initial.imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    const newErrors: Partial<CreateEquipmentReq> = {};
    if (!form.name.trim()) newErrors.name = "Tên thiết bị không được để trống";
    if (!form.imageUrl) newErrors.imageUrl = "Vui lòng chọn ảnh thiết bị";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (isCreate) {
        await props.onSubmit!(form);
      } else {
        await props.onUpdate!(props.equipment.equipmentId, form);
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initial);
    setErrors({});
    setPreviewUrl(isCreate ? null : props.equipment?.imageUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  const isBusy = isSubmitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="!max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            {isCreate ? "Thêm thiết bị mới" : "Chi tiết thiết bị"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* ── Image picker ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Ảnh thiết bị <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-36 h-36 shrink-0">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-36 h-36 rounded-2xl object-cover border-2 border-orange-100"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 rounded-2xl bg-black/40 flex flex-col items-center justify-center gap-1">
                        <LoaderCircle
                          size={18}
                          className="animate-spin text-white"
                        />
                        <span className="text-white text-[10px] font-semibold">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    )}
                    {!isUploading && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center text-orange-300 gap-1">
                    <ImagePlus size={22} />
                    <span className="text-[10px]">Chưa có ảnh</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2.5 w-full justify-center border border-orange-200 rounded-xl text-sm text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UploadCloud size={15} />
                  {isUploading
                    ? `Đang tải lên... ${Math.round(progress)}%`
                    : "Chọn ảnh từ máy"}
                </button>
                <p className="text-[10px] text-gray-400 text-center">
                  PNG, JPG, WEBP · Tối đa 5MB
                </p>
              </div>
            </div>
            {errors.imageUrl && (
              <p className="text-xs text-red-500">{errors.imageUrl}</p>
            )}
          </div>

          {/* ── Name ── */}
          <Field label="Tên thiết bị" required error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Thảm Yoga, Tạ tay..."
              className={inputClass(!!errors.name)}
              disabled={isBusy}
            />
          </Field>

          {/* ── Description ── */}
          <Field label="Mô tả" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả ngắn về thiết bị..."
              rows={3}
              className={`${inputClass(false)} resize-none`}
              disabled={isBusy}
            />
          </Field>

          {/* ── Metadata (chỉ hiện ở detail mode) ── */}
          {!isCreate && (
            <div className="border border-orange-100 rounded-xl p-4 space-y-2.5 text-sm bg-orange-50/40">
              <InfoRow
                label="Ngày tạo"
                value={formatLocalDateTime(props.equipment.createdAt, "date")}
              />
              <InfoRow
                label="Cập nhật"
                value={formatLocalDateTime(props.equipment.updatedAt, "date")}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isBusy}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isBusy || (!isCreate && !isDirty)}
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"
          >
            {isSubmitting && (
              <LoaderCircle size={15} className="animate-spin mr-1.5" />
            )}
            {isCreate ? "Tạo thiết bị" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-300 focus:ring-red-200"
      : "border-orange-200 focus:ring-orange-200"
  }`;

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-600">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-700 text-right">{value}</span>
  </div>
);

export default DetailModal;
