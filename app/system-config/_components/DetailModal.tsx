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
import {
  SystemConfigType,
  UpdateSystemConfigReq,
} from "@/utils/SystemConfigType";
import { getSystemConfigLabel } from "@/utils/uiMapper";
import { formatLocalDateTime } from "@/utils/day";

type SystemConfigForm = {
  value: string;
  description: string;
};

type SystemConfigFormError = Partial<Record<keyof SystemConfigForm, string>>;

const validateForm = (form: SystemConfigForm): SystemConfigFormError => {
  const errors: SystemConfigFormError = {};
  if (!form.value.trim()) errors.value = "Giá trị không được để trống";
  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SystemConfigType | null;
  onUpdate: (configId: string, payload: UpdateSystemConfigReq) => void;
};

const DetailModal = ({ open, onOpenChange, config, onUpdate }: Props) => {
  const [initialForm, setInitialForm] = useState<SystemConfigForm | null>(null);
  const [form, setForm] = useState<SystemConfigForm>({
    value: "",
    description: "",
  });
  const [touched, setTouched] = useState<
    Partial<Record<keyof SystemConfigForm, boolean>>
  >({});
  const [errors, setErrors] = useState<SystemConfigFormError>({});

  const isValid = Object.keys(errors).length === 0;
  const isDirty =
    !!initialForm &&
    (form.value !== initialForm.value ||
      form.description !== initialForm.description);

  const handleChange = <K extends keyof SystemConfigForm>(
    key: K,
    value: string,
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

  const handleBlur = (key: keyof SystemConfigForm) => {
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
    setTouched({ value: true, description: true });
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !isDirty || !config) return;

    onUpdate(config.configId, {
      key: config.key,
      value: form.value,
      description: form.description,
    });
  };

  useEffect(() => {
    if (open && config) {
      const init: SystemConfigForm = {
        value: config.value,
        description: config.description ?? "",
      };
      setForm(init);
      setInitialForm(init);
      setTouched({});
      setErrors({});
    }
  }, [open, config]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Cấu hình hệ thống
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Key — read-only */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Tên cấu hình
            </label>
            <div className="px-3 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium text-sm">
              {config ? getSystemConfigLabel(config.key) : "—"}
            </div>
          </div>

          {/* Value */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Giá trị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              onBlur={() => handleBlur("value")}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
                errors.value && touched.value
                  ? "border-red-400 focus:border-red-500"
                  : "border-orange-200 focus:border-orange-400"
              }`}
              placeholder="Nhập giá trị..."
            />
            {errors.value && touched.value && (
              <p className="text-xs text-red-500">{errors.value}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-orange-200 focus:border-orange-400 text-sm outline-none transition resize-none"
              placeholder="Nhập mô tả..."
            />
          </div>

          {/* Read-only timestamps */}
          {config && (
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tạo</span>
                <span>
                  {new Date(config.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cập nhật lần cuối</span>
                <span>{formatLocalDateTime(config.updatedAt, "datetime")}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isDirty || !isValid}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
