"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ReportReasonType,
  UpdateReportReasonReq,
} from "@/utils/ReportReasonType";
import { formatLocalDateTime } from "@/utils/day";

type Form = {
  name: string;
  code: string;
  description: string;
  requiresDescription: boolean;
  active: boolean;
};

type FormError = Partial<Record<keyof Form, string>>;

const CODE_REGEX = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/;

const validate = (form: Form): FormError => {
  const errors: FormError = {};

  if (!form.name.trim()) errors.name = "Tên không được để trống";
  else if (form.name.trim().length < 2)
    errors.name = "Tên phải có ít nhất 2 ký tự";

  if (!form.code.trim()) errors.code = "Mã code không được để trống";
  else if (!CODE_REGEX.test(form.code.trim()))
    errors.code = "Mã code phải dạng UPPER_SNAKE_CASE (VD: COACH_NO_SHOW)";

  if (!form.description.trim())
    errors.description = "Mô tả không được để trống";

  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ReportReasonType;
  onSubmit: (payload: UpdateReportReasonReq) => void;
};

const DetailModal = ({ open, onOpenChange, item, onSubmit }: Props) => {
  const [initialForm, setInitialForm] = useState<Form | null>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    code: "",
    description: "",
    requiresDescription: false,
    active: false,
  });
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});

  const isDirty =
    !!initialForm &&
    (form.name !== initialForm.name ||
      form.code !== initialForm.code ||
      form.description !== initialForm.description ||
      form.requiresDescription !== initialForm.requiresDescription ||
      form.active !== initialForm.active);

  const isValid = Object.keys(validate(form)).length === 0;

  const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validate(updated);
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

  const handleBlur = (key: keyof Form) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validate(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[key]) next[key] = errs[key];
      else delete next[key];
      return next;
    });
  };

  const handleCodeChange = (raw: string) => {
    const formatted = raw.toUpperCase().replace(/\s+/g, "_");
    handleChange("code", formatted);
  };

  const handleSubmit = () => {
    if (!isDirty || !isValid) return;
    onSubmit({
      name: form.name.trim(),
      code: form.code.trim() as any,
      description: form.description.trim(),
      requiresDescription: form.requiresDescription,
      active: form.active,
    });
  };

  useEffect(() => {
    if (open && item) {
      const init: Form = {
        name: item.name,
        code: item.code,
        description: item.description ?? "",
        requiresDescription: item.requiresDescription,
        active: item.active,
      };
      setForm(init);
      setInitialForm(init);
      setTouched({});
      setErrors({});
    }
  }, [open, item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết lý do báo cáo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field>
              <Label>Tên lý do</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ví dụ: HLV không xuất hiện"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </Field>

            {/* Code */}
            <Field>
              <Label>Mã code</Label>
              <Input
                value={form.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onBlur={() => handleBlur("code")}
                placeholder="VD: COACH_NO_SHOW"
                className="font-mono"
              />
              <p className="text-xs text-gray-400">
                Dạng UPPER_SNAKE_CASE, tự động chuyển hoa
              </p>
              {touched.code && errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </Field>

            {/* Description */}
            <Field>
              <Label>Mô tả</Label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Mô tả chi tiết về lý do này..."
                rows={3}
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </Field>

            {/* Requires Description */}
            <Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiresDescription}
                  onChange={(e) =>
                    handleChange("requiresDescription", e.target.checked)
                  }
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Bắt buộc nhập mô tả khi báo cáo
                </span>
              </label>
            </Field>

            {/* Active */}
            <Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Đang hoạt động
                </span>
              </label>
            </Field>
          </FieldGroup>

          {/* Readonly info */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(item.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cập nhật lần cuối</span>
              <span>{formatLocalDateTime(item.updatedAt)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
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
