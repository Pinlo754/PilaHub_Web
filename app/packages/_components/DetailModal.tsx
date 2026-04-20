"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreatePackageReq,
  PackageType,
  UpdatePackageReq,
} from "@/utils/PackageType";
import { PACKAGE, PackageType as PackageTypeEnum } from "@/utils/AccountType";
import { getPackageLabel } from "@/utils/uiMapper";

// ---- FORM TYPE ----
type PackageForm = {
  packageName: string;
  description: string;
  price: string;
  durationInDays: string;
  packageType: PackageTypeEnum;
  isActive: boolean;
};

type PackageFormError = Partial<Record<keyof PackageForm, string>>;

const validateForm = (form: PackageForm): PackageFormError => {
  const errors: PackageFormError = {};
  if (!form.packageName.trim())
    errors.packageName = "Tên gói không được để trống";
  if (!form.description.trim())
    errors.description = "Mô tả không được để trống";
  const price = Number(form.price);
  if (!form.price || isNaN(price) || price <= 0)
    errors.price = "Giá phải là số dương";
  const duration = Number(form.durationInDays);
  if (
    !form.durationInDays ||
    isNaN(duration) ||
    duration <= 0 ||
    !Number.isInteger(duration)
  )
    errors.durationInDays = "Thời hạn phải là số nguyên dương";
  return errors;
};

// ---- PROPS ----
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg?: PackageType | null; // null = create mode
  onCreate: (payload: CreatePackageReq) => void;
  onUpdate: (packageId: string, payload: UpdatePackageReq) => void;
};

const EMPTY_FORM: PackageForm = {
  packageName: "",
  description: "",
  price: "",
  durationInDays: "",
  packageType: PACKAGE.Member,
  isActive: true,
};

const DetailModal = ({
  open,
  onOpenChange,
  pkg,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditMode = !!pkg;

  const [initialForm, setInitialForm] = useState<PackageForm | null>(null);
  const [form, setForm] = useState<PackageForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof PackageForm, boolean>>
  >({});
  const [errors, setErrors] = useState<PackageFormError>({});

  // ---- COMPUTED ----
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([key]) => touched[key as keyof PackageForm]),
  );
  const isValid =
    Object.keys(visibleErrors).length === 0 && Object.keys(errors).length === 0;

  const isDirty =
    !isEditMode ||
    (!!initialForm &&
      (form.packageName !== initialForm.packageName ||
        form.description !== initialForm.description ||
        form.price !== initialForm.price ||
        form.durationInDays !== initialForm.durationInDays ||
        form.packageType !== initialForm.packageType ||
        form.isActive !== initialForm.isActive));

  // ---- HANDLERS ----
  const handleChange = <K extends keyof PackageForm>(
    key: K,
    value: PackageForm[K],
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validateForm(updated);
        setErrors((prev) => {
          const next = { ...prev };
          if (errs[key]) next[key] = errs[key];
          else delete next[key];
          return next;
        });
      }
      return updated;
    });
  };

  const handleBlur = (key: keyof PackageForm) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateForm(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[key]) next[key] = errs[key];
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    // touch all
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof PackageForm, boolean>,
    );
    setTouched(allTouched);

    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!isDirty) return;

    const payload = {
      packageName: form.packageName,
      description: form.description,
      price: Number(form.price),
      durationInDays: Number(form.durationInDays),
      packageType: form.packageType,
      isActive: form.isActive,
    };

    if (isEditMode && pkg) {
      onUpdate(pkg.packageId, payload);
    } else {
      onCreate(payload);
    }
  };

  // ---- EFFECTS ----
  useEffect(() => {
    if (open) {
      if (pkg) {
        const init: PackageForm = {
          packageName: pkg.packageName,
          description: pkg.description,
          price: String(pkg.price),
          durationInDays: String(pkg.durationInDays),
          packageType: pkg.packageType,
          isActive: pkg.isActive,
        };
        setForm(init);
        setInitialForm(init);
      } else {
        setForm(EMPTY_FORM);
        setInitialForm(null);
      }
      setTouched({});
      setErrors({});
    }
  }, [open, pkg]);

  const packageTypes = Object.values(PACKAGE) as PackageTypeEnum[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            {isEditMode ? "Chi tiết gói dịch vụ" : "Tạo gói dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldGroup>
            {/* Package Name */}
            <Field>
              <Label>Tên gói</Label>
              <Input
                value={form.packageName}
                onChange={(e) => handleChange("packageName", e.target.value)}
                onBlur={() => handleBlur("packageName")}
                placeholder="Nhập tên gói"
              />
              {touched.packageName && errors.packageName && (
                <p className="text-xs text-red-500">{errors.packageName}</p>
              )}
            </Field>

            {/* Description */}
            <Field>
              <Label>Mô tả</Label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Nhập mô tả gói"
                className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </Field>

            {/* Price */}
            <Field>
              <Label>Giá (VNĐ)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="Nhập giá"
                min={0}
              />
              {touched.price && errors.price && (
                <p className="text-xs text-red-500">{errors.price}</p>
              )}
            </Field>

            {/* Duration */}
            <Field>
              <Label>Thời hạn (ngày)</Label>
              <Input
                type="number"
                value={form.durationInDays}
                onChange={(e) => handleChange("durationInDays", e.target.value)}
                onBlur={() => handleBlur("durationInDays")}
                placeholder="Nhập số ngày"
                min={1}
              />
              {touched.durationInDays && errors.durationInDays && (
                <p className="text-xs text-red-500">{errors.durationInDays}</p>
              )}
            </Field>

            {/* Package Type */}
            <Field>
              <Label>Loại gói</Label>
              <Select
                value={form.packageType}
                onValueChange={(v) => {
                  handleChange("packageType", v as PackageTypeEnum);
                  handleBlur("packageType");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại gói" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getPackageLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Status — only in edit mode */}
            {isEditMode && (
              <Field>
                <Label>Trạng thái</Label>
                <Select
                  value={form.isActive ? "ACTIVE" : "INACTIVE"}
                  onValueChange={(v) => {
                    handleChange("isActive", v === "ACTIVE");
                    handleBlur("isActive");
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
          </FieldGroup>

          {/* Read-only info */}
          {isEditMode && pkg && (
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tạo</span>
                <span>{new Date(pkg.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cập nhật lần cuối</span>
                <span>{new Date(pkg.updatedAt).toLocaleString("vi-VN")}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isEditMode ? !isDirty || !isValid : !isValid}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            {isEditMode ? "Lưu thay đổi" : "Tạo gói"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
