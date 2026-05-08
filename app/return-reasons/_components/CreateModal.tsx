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
import { CreateReturnReasonReq } from "@/utils/ReturnReasonType";

type Form = {
  code: string;
  description: string;
  enabled: boolean;
};

type FormError = Partial<Record<keyof Form, string>>;

const CODE_REGEX = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/;

const validate = (form: Form): FormError => {
  const errors: FormError = {};

  if (!form.code.trim()) errors.code = "Mã code không được để trống";
  else if (!CODE_REGEX.test(form.code.trim()))
    errors.code = "Mã code phải dạng UPPER_SNAKE_CASE (VD: WRONG_ITEM)";

  if (!form.description.trim())
    errors.description = "Mô tả không được để trống";

  return errors;
};

const INITIAL: Form = {
  code: "",
  description: "",
  enabled: true,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateReturnReasonReq) => void;
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

  const handleCodeChange = (raw: string) => {
    const formatted = raw.toUpperCase().replace(/\s+/g, "_");
    handleChange("code", formatted);
  };

  const handleSubmit = () => {
    const allTouched = { code: true, description: true, enabled: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      code: form.code.trim() as any,
      description: form.description.trim(),
      enabled: form.enabled,
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
            Thêm lý do hoàn trả
          </DialogTitle>
        </DialogHeader>

        <FieldGroup>
          {/* Code */}
          <Field>
            <Label>Mã code</Label>
            <Input
              value={form.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onBlur={() => handleBlur("code")}
              placeholder="VD: WRONG_ITEM"
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

          {/* Enabled */}
          <Field>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Đang hoạt động
              </span>
            </label>
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
