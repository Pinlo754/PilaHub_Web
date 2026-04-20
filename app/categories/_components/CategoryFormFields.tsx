"use client";

import { useRef, useState } from "react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUp, Loader2, X } from "lucide-react";
import { CategoryType as CategoryEntity } from "@/utils/CategoryType";
import { CategoryType } from "@/utils/ProductType";
import { CATEGORY_TYPE } from "@/utils/ProductType";
import { getCategoryTypeConfig } from "@/utils/uiMapper";
import { CategoryForm, CategoryFormError } from "./DetailModal";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";

type Props = {
  form: CategoryForm;
  errors: CategoryFormError;
  touched: Partial<Record<keyof CategoryForm, boolean>>;
  isEditMode: boolean;
  parentCategories: CategoryEntity[];
  handleChange: <K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K],
  ) => void;
  handleBlur: (key: keyof CategoryForm) => void;
};

const CATEGORY_TYPE_OPTIONS = Object.values(CATEGORY_TYPE) as CategoryType[];

const CategoryFormFields = ({
  form,
  errors,
  touched,
  isEditMode,
  parentCategories,
  handleChange,
  handleBlur,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, loading: uploading, progress } = useFirebaseUpload();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const url = await uploadFile(file, "categories");
      handleChange("imageUrl", url);
    } catch {
      // error handled upstream
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="space-y-4">
      {/* Image upload — full width, large preview */}
      <div>
        <Label>Ảnh danh mục</Label>
        <div className="mt-1">
          {form.imageUrl ? (
            <div className="relative group">
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-full h-52 object-cover rounded-xl border-2 border-orange-200"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition"
                >
                  Thay ảnh
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("imageUrl", "")}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition
                ${dragOver ? "border-orange-400 bg-orange-50" : "border-orange-200 hover:border-orange-400 hover:bg-orange-50/50"}
                ${uploading ? "pointer-events-none" : ""}`}
            >
              {uploading ? (
                <>
                  <Loader2 size={24} className="text-orange-400 animate-spin" />
                  <p className="text-xs text-orange-500 font-medium">
                    {Math.round(progress)}%
                  </p>
                  <div className="w-32 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <ImageUp size={28} className="text-orange-300" />
                  <p className="text-xs text-gray-500">
                    Kéo thả hoặc{" "}
                    <span className="text-orange-600 font-medium">
                      chọn ảnh
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Name */}
        <Field>
          <Label>
            Tên danh mục <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Nhập tên danh mục"
          />
          {touched.name && errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </Field>

        {/* Category Type */}
        <Field>
          <Label>Loại danh mục</Label>
          <Select
            value={form.categoryType ?? "NONE"}
            onValueChange={(v) => {
              handleChange(
                "categoryType",
                v === "NONE" ? null : (v as CategoryType),
              );
              handleBlur("categoryType");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">— Không chọn —</SelectItem>
              {CATEGORY_TYPE_OPTIONS.map((type) => {
                const cfg = getCategoryTypeConfig(type);
                return (
                  <SelectItem key={type} value={type}>
                    {cfg.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Field>

        {/* Parent Category */}
        <Field>
          <Label>Danh mục cha</Label>
          <Select
            value={form.parentCategoryId ?? "NONE"}
            onValueChange={(v) => {
              handleChange("parentCategoryId", v === "NONE" ? null : v);
              handleBlur("parentCategoryId");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Không có" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">— Không có —</SelectItem>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Status — edit only */}
        {isEditMode && (
          <Field>
            <Label>Trạng thái</Label>
            <Select
              value={form.active ? "ACTIVE" : "INACTIVE"}
              onValueChange={(v) => {
                handleChange("active", v === "ACTIVE");
                handleBlur("active");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      {/* Description — full width */}
      <Field>
        <Label>Mô tả</Label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          placeholder="Nhập mô tả danh mục"
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </Field>
    </div>
  );
};

export default CategoryFormFields;
