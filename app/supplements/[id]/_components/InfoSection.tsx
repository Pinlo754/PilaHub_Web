"use client";

import { useState, useEffect, MutableRefObject } from "react";
import { SupplementType, UpdateSupplementReq } from "@/utils/SupplementType";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatLocalDateTime } from "@/utils/day";
import { ImageIcon, Loader2, PowerOff, Power, Trash2 } from "lucide-react";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";

type Form = {
  name: string;
  description: string;
  brand: string;
  form: string;
  usageInstructions: string;
  benefits: string;
  sideEffects: string;
  contraindications: string;
  warnings: string;
  imageUrl: string;
};
type FormError = Partial<Record<keyof Form, string>>;

const validate = (f: Form): FormError => {
  const e: FormError = {};
  if (!f.name.trim()) e.name = "Tên không được để trống";
  if (!f.description.trim()) e.description = "Mô tả không được để trống";
  if (!f.brand.trim()) e.brand = "Thương hiệu không được để trống";
  if (!f.form.trim()) e.form = "Dạng sản phẩm không được để trống";
  return e;
};

type Props = {
  supplement: SupplementType;
  onUpdate: (payload: UpdateSupplementReq, imageFile?: File | null) => void;
  onToggleActive: () => void;
  onDelete: () => void;
  isLoading: boolean;
  submitRef: MutableRefObject<(() => void) | null>;
};

const InfoSection = ({
  supplement,
  onUpdate,
  onToggleActive,
  onDelete,
  isLoading,
  submitRef,
}: Props) => {
  const [form, setForm] = useState<Form>({
    name: "",
    description: "",
    brand: "",
    form: "",
    usageInstructions: "",
    benefits: "",
    sideEffects: "",
    contraindications: "",
    warnings: "",
    imageUrl: "",
  });
  const [initialForm, setInitialForm] = useState<Form | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fix: đổi `uploading` → dùng alias từ `loading`
  const { loading: uploading, progress } = useFirebaseUpload();

  useEffect(() => {
    const init: Form = {
      name: supplement.name,
      description: supplement.description ?? "",
      brand: supplement.brand ?? "",
      form: supplement.form ?? "",
      usageInstructions: supplement.usageInstructions ?? "",
      benefits: supplement.benefits ?? "",
      sideEffects: supplement.sideEffects ?? "",
      contraindications: supplement.contraindications ?? "",
      warnings: supplement.warnings ?? "",
      imageUrl: supplement.imageUrl ?? "",
    };
    setForm(init);
    setInitialForm(init);
    setTouched({});
    setErrors({});
    setImageFile(null);
    setImagePreview("");
  }, [supplement]);

  const isDirty =
    !!initialForm &&
    (imageFile !== null ||
      Object.keys(form).some(
        (k) => form[k as keyof Form] !== initialForm[k as keyof Form],
      ));
  const isValid = Object.keys(validate(form)).length === 0;

  const handleChange = <K extends keyof Form>(key: K, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validate(updated);
        setErrors((p) => {
          const n = { ...p };
          if (errs[key]) n[key] = errs[key];
          else delete n[key];
          return n;
        });
      }
      return updated;
    });
  };

  const handleBlur = (key: keyof Form) => {
    setTouched((p) => ({ ...p, [key]: true }));
    const errs = validate(form);
    setErrors((p) => {
      const n = { ...p };
      if (errs[key]) n[key] = errs[key];
      else delete n[key];
      return n;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!isDirty || !isValid) return;
    onUpdate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        brand: form.brand.trim(),
        form: form.form.trim(),
        usageInstructions: form.usageInstructions.trim(),
        benefits: form.benefits.trim(),
        sideEffects: form.sideEffects.trim(),
        contraindications: form.contraindications.trim(),
        warnings: form.warnings.trim(),
        imageUrl: form.imageUrl.trim(),
      },
      imageFile,
    );
  };

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [form, imageFile, isDirty, isValid]);

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-orange-700">
          Thông tin sản phẩm
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onToggleActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              supplement.active
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {supplement.active ? (
              <>
                <PowerOff size={14} /> Tắt
              </>
            ) : (
              <>
                <Power size={14} /> Kích hoạt
              </>
            )}
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            <Trash2 size={14} /> Xoá
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {imagePreview || form.imageUrl ? (
            <img
              src={imagePreview || form.imageUrl}
              alt="preview"
              className="w-28 h-28 rounded-xl object-cover border-2 border-orange-200"
            />
          ) : (
            <div className="w-28 h-28 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center text-orange-300 gap-1">
              <ImageIcon size={28} />
              <span className="text-xs">Chưa có ảnh</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label>Ảnh sản phẩm</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-3 block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          {uploading && (
            <p className="text-xs text-orange-500 mt-1">
              Đang tải ảnh... {Math.round(progress)}%
            </p>
          )}
          {/* <p className="text-xs text-gray-400 mt-1">Hoặc nhập URL:</p>
          <Input
            value={form.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="https://..."
            className="mt-1"
          /> */}
        </div>
      </div>

      <FieldGroup>
        <Field>
          <Label>
            Tên sản phẩm <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {touched.name && errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </Field>
        <Field>
          <Label>
            Mô tả <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            rows={2}
          />
          {touched.description && errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label>
              Thương hiệu <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              onBlur={() => handleBlur("brand")}
            />
            {touched.brand && errors.brand && (
              <p className="text-xs text-red-500">{errors.brand}</p>
            )}
          </Field>
          <Field>
            <Label>
              Dạng sản phẩm <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.form}
              onChange={(e) => handleChange("form", e.target.value)}
              onBlur={() => handleBlur("form")}
            />
            {touched.form && errors.form && (
              <p className="text-xs text-red-500">{errors.form}</p>
            )}
          </Field>
        </div>
        <Field>
          <Label>Hướng dẫn sử dụng</Label>
          <Textarea
            value={form.usageInstructions}
            onChange={(e) => handleChange("usageInstructions", e.target.value)}
            rows={2}
          />
        </Field>
        <Field>
          <Label>Lợi ích</Label>
          <Textarea
            value={form.benefits}
            onChange={(e) => handleChange("benefits", e.target.value)}
            rows={2}
          />
        </Field>
        <Field>
          <Label>Tác dụng phụ</Label>
          <Textarea
            value={form.sideEffects}
            onChange={(e) => handleChange("sideEffects", e.target.value)}
            rows={2}
          />
        </Field>
        <Field>
          <Label>Chống chỉ định</Label>
          <Textarea
            value={form.contraindications}
            onChange={(e) => handleChange("contraindications", e.target.value)}
            rows={2}
          />
        </Field>
        <Field>
          <Label>Cảnh báo</Label>
          <Textarea
            value={form.warnings}
            onChange={(e) => handleChange("warnings", e.target.value)}
            rows={2}
          />
        </Field>
      </FieldGroup>

      {/* Readonly info */}
      <div className="border-t pt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Trạng thái: </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${supplement.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
          >
            {supplement.active ? "Đang hoạt động" : "Tạm dừng"}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Ngày tạo: </span>
          {formatLocalDateTime(supplement.createdAt)}
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Cập nhật lần cuối: </span>
          {formatLocalDateTime(supplement.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
