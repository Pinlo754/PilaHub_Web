"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CreateAssessmentCriterionReq } from "@/utils/AssessmentCriterionType";

type Form = {
  name: string;
  description: string;
  displayOrder: string; // string để dễ input, parse khi submit
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

const INITIAL: Form = {
  name: "",
  description: "",
  displayOrder: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateAssessmentCriterionReq) => void;
};

const CreateModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<Form>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});

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
    const allTouched: Record<keyof Form, boolean> = {
      name: true,
      description: true,
      displayOrder: true,
    };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      displayOrder: Number(form.displayOrder),
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setForm(INITIAL);
      setTouched({});
      setErrors({});
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Thêm tiêu chí đánh giá
          </DialogTitle>
        </DialogHeader>

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
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
          >
            Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;