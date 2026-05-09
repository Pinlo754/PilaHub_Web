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
  AssessmentCriterionType,
  UpdateAssessmentCriterionReq,
} from "@/utils/AssessmentCriterionType";
import { formatLocalDateTime } from "@/utils/day";

type Form = {
  name: string;
  description: string;
  displayOrder: string;
  isActive: boolean;
};

type FormError = Partial<Record<keyof Form, string>>;

const validate = (form: Form): FormError => {
  const errors: FormError = {};

  if (!form.name.trim()) errors.name = "Tên không được để trống";
  else if (form.name.trim().length < 2)
    errors.name = "Tên phải có ít nhất 2 ký tự";

  if (!form.description.trim())
    errors.description = "Mô tả không được để trống";

  const order = Number(form.displayOrder);
  if (form.displayOrder.trim() === "")
    errors.displayOrder = "Thứ tự hiển thị không được để trống";
  else if (!Number.isInteger(order) || order < 0)
    errors.displayOrder = "Thứ tự phải là số nguyên không âm";

  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AssessmentCriterionType;
  onSubmit: (payload: UpdateAssessmentCriterionReq) => void;
};

const DetailModal = ({ open, onOpenChange, item, onSubmit }: Props) => {
  const [initialForm, setInitialForm] = useState<Form | null>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    description: "",
    displayOrder: "",
    isActive: false,
  });
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});

  const isDirty =
    !!initialForm &&
    (form.name !== initialForm.name ||
      form.description !== initialForm.description ||
      form.displayOrder !== initialForm.displayOrder ||
      form.isActive !== initialForm.isActive);

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

  const handleSubmit = () => {
    if (!isDirty || !isValid) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    });
  };

  useEffect(() => {
    if (open && item) {
      const init: Form = {
        name: item.name,
        description: item.description ?? "",
        displayOrder: String(item.displayOrder),
        isActive: item.isActive,
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
            Chi tiết tiêu chí đánh giá
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field>
              <Label>Tên tiêu chí</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ví dụ: Kỹ năng giao tiếp"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </Field>

            {/* Description */}
            <Field>
              <Label>Mô tả</Label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Mô tả chi tiết về tiêu chí này..."
                rows={3}
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </Field>

            {/* Display Order */}
            <Field>
              <Label>Thứ tự hiển thị</Label>
              <Input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) => handleChange("displayOrder", e.target.value)}
                onBlur={() => handleBlur("displayOrder")}
                placeholder="Ví dụ: 1"
              />
              {touched.displayOrder && errors.displayOrder && (
                <p className="text-xs text-red-500">{errors.displayOrder}</p>
              )}
            </Field>

            {/* isActive */}
            <Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
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