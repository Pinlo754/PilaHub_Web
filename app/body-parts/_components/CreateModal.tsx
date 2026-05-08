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
import { CreateBodyPartReq } from "@/utils/BodyPartType";

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

const INITIAL: Form = { name: "", description: "" };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateBodyPartReq) => void;
};

const CreateModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<Form>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<FormError>({});

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
    const allTouched: Partial<Record<keyof Form, boolean>> = {
      name: true,
      description: true,
    };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({ name: form.name.trim(), description: form.description.trim() });
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
            Thêm bộ phận cơ thể
          </DialogTitle>
        </DialogHeader>

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
