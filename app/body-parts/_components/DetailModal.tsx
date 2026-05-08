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
import { BodyPartType, UpdateBodyPartReq } from "@/utils/BodyPartType";
import { formatLocalDateTime } from "@/utils/day";

type Form = {
  name: string;
  description: string;
};

type FormError = Partial<Record<keyof Form, string>>;

const validate = (form: Form): FormError => {
  const errors: FormError = {};
  if (!form.name.trim()) errors.name = "Tên không được để trống";
  else if (form.name.trim().length < 2)
    errors.name = "Tên phải có ít nhất 2 ký tự";
  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bodyPart: BodyPartType;
  onSubmit: (payload: UpdateBodyPartReq) => void;
};

const DetailModal = ({ open, onOpenChange, bodyPart, onSubmit }: Props) => {
  const [initialForm, setInitialForm] = useState<Form | null>(null);
  const [form, setForm] = useState<Form>({ name: "", description: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});

  const isDirty =
    !!initialForm &&
    (form.name !== initialForm.name ||
      form.description !== initialForm.description);

  const isValid = Object.keys(validate(form)).length === 0;

  const handleChange = <K extends keyof Form>(key: K, value: string) => {
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
    onSubmit({ name: form.name.trim(), description: form.description.trim() });
  };

  useEffect(() => {
    if (open && bodyPart) {
      const init: Form = {
        name: bodyPart.name,
        description: bodyPart.description ?? "",
      };
      setForm(init);
      setInitialForm(init);
      setTouched({});
      setErrors({});
    }
  }, [open, bodyPart]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết bộ phận cơ thể
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field>
              <Label>Tên bộ phận</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ví dụ: Ngực, Lưng, Vai..."
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
                placeholder="Mô tả về bộ phận cơ thể này..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          {/* Readonly info */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(bodyPart.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cập nhật lần cuối</span>
              <span>{formatLocalDateTime(bodyPart.updatedAt)}</span>
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
