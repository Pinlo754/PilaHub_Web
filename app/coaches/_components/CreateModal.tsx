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
import { CreateAccountReq } from "@/utils/AccountType";
import { Eye, EyeOff } from "lucide-react";

type CreateForm = {
  email: string;
  phoneNumber: string;
  password: string;
};

type CreateFormError = Partial<Record<keyof CreateForm, string>>;

const validateCreateForm = (form: CreateForm): CreateFormError => {
  const errors: CreateFormError = {};

  if (!form.email) {
    errors.email = "Email không được để trống";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!form.phoneNumber) {
    errors.phoneNumber = "Số điện thoại không được để trống";
  } else if (!/^[0-9]{10,11}$/.test(form.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
  }

  if (!form.password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (form.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateAccountReq) => void;
};

const CreateModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const INITIAL_FORM: CreateForm = { email: "", phoneNumber: "", password: "" };

  const [form, setForm] = useState<CreateForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof CreateForm, boolean>>
  >({});
  const [errors, setErrors] = useState<CreateFormError>({});
  const [showPassword, setShowPassword] = useState(false);

  const isValid = Object.keys(validateCreateForm(form)).length === 0;

  const handleChange = <K extends keyof CreateForm>(key: K, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      if (touched[key]) {
        const validationErrors = validateCreateForm(updated);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (validationErrors[key]) {
            newErrors[key] = validationErrors[key];
          } else {
            delete newErrors[key];
          }
          return newErrors;
        });
      }

      return updated;
    });
  };

  const handleBlur = (key: keyof CreateForm) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const validationErrors = validateCreateForm(form);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (validationErrors[key]) {
        newErrors[key] = validationErrors[key];
      } else {
        delete newErrors[key];
      }
      return newErrors;
    });
  };

  const handleSubmit = () => {
    // touch all fields
    const allTouched = { email: true, phoneNumber: true, password: true };
    setTouched(allTouched);
    const validationErrors = validateCreateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      email: form.email,
      phoneNumber: form.phoneNumber,
      password: form.password,
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setForm(INITIAL_FORM);
      setTouched({});
      setErrors({});
      setShowPassword(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Tạo tài khoản HLV
          </DialogTitle>
        </DialogHeader>

        <FieldGroup>
          {/* Email */}
          <Field>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="coach@example.com"
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </Field>

          {/* Phone */}
          <Field>
            <Label>Số điện thoại</Label>
            <Input
              value={form.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              onBlur={() => handleBlur("phoneNumber")}
              placeholder="0xxxxxxxxx"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </Field>

          {/* Password */}
          <Field>
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Tối thiểu 6 ký tự"
                className="pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
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
            Tạo tài khoản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
