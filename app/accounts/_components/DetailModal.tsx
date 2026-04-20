"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AccountType,
  ROLE,
  RoleType,
  UpdateAccountReq,
} from "@/utils/AccountType";
import { formatLocalDateTime } from "@/utils/day";
import { ACCOUNT_ROLE_MAP } from "@/utils/uiMapper";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccountForm,
  AccountFormError,
  validateAccountForm,
} from "@/utils/account.validator";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: AccountType;
  onSubmit: (payload: UpdateAccountReq) => void;
};

const DetailModal = ({ open, onOpenChange, account, onSubmit }: Props) => {
  // STATE
  const [initialForm, setInitialForm] = useState<AccountForm | null>(null);
  const [form, setForm] = useState<AccountForm>({
    email: "",
    phoneNumber: "",
    role: account.role,
    active: false,
  });
  const [touched, setTouched] = useState<
    Partial<Record<keyof typeof form, boolean>>
  >({});
  const [errors, setErrors] = useState<AccountFormError>({});

  // VARIABLE
  const isValid =
    Object.keys(errors).filter((key) => touched[key as keyof AccountForm])
      .length === 0;
  const isDirty =
    !!initialForm &&
    (form.phoneNumber !== initialForm.phoneNumber ||
      form.role !== initialForm.role ||
      form.active !== initialForm.active);

  const roles = Object.keys(ACCOUNT_ROLE_MAP) as RoleType[];

  // HANDLER
  const handleChange = <K extends keyof AccountForm>(
    key: K,
    value: AccountForm[K],
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      if (touched[key]) {
        const validationErrors = validateAccountForm(updated);

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

  const handleBlur = (key: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [key]: true }));

    const validationErrors = validateAccountForm(form);

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
    if (!isValid || !isDirty) return;

    onSubmit({
      email: account.email,
      phoneNumber: form.phoneNumber,
      role: form.role as RoleType,
      active: form.active,
      emailVerified: account.emailVerified,
    });
  };

  // USE EFFECT
  useEffect(() => {
    if (open && account) {
      const initData = {
        email: account.email,
        phoneNumber: account.phoneNumber,
        role: account.role,
        active: account.active,
      };

      setForm(initData);
      setInitialForm(initData);
      setTouched({});
      setErrors(validateAccountForm(initData));
    }
  }, [open, account]);

  useEffect(() => {
    if (!open) {
      setTouched({});
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Chi tiết tài khoản
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ===== FORM ===== */}
          <FieldGroup>
            {/* Email */}
            <Field>
              <Label>Email</Label>
              <div className="px-3 py-2 rounded-md text-sm bg-gray-50 text-gray-500 border border-gray-200">
                {account.email}
              </div>
            </Field>

            {/* Phone */}
            <Field>
              <Label>Số điện thoại</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </Field>

            {/* Role */}
            <Field>
              <Label>Vai trò</Label>
              <Select
                value={form.role}
                onValueChange={(v) => {
                  handleChange("role", v as RoleType);
                  handleBlur("role");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ACCOUNT_ROLE_MAP[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.role && errors.role && (
                <p className="text-xs text-red-500">{errors.role}</p>
              )}
            </Field>

            {/* Email Verified */}
            <Field>
              <Label>Tình trạng xác thực</Label>
              <div
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  account.emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {account.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </div>
            </Field>

            {/* Status*/}
            <Field>
              <Label>Trạng thái hoạt động</Label>
              <Select
                value={form.active ? "ACTIVE" : "INACTIVE"}
                onValueChange={(v) => {
                  if (v === "ACTIVE" && !account.emailVerified) return; // chặn

                  handleChange("active", v === "ACTIVE");
                  handleBlur("active");
                }}
                disabled={!account.emailVerified}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>

              {!account.emailVerified && (
                <p className="text-xs text-red-500 mt-1">
                  Phải xác thực email trước khi kích hoạt tài khoản
                </p>
              )}
              {touched.active && errors.active && (
                <p className="text-xs text-red-500">{errors.active}</p>
              )}
            </Field>
          </FieldGroup>

          {/* ===== INFO (READONLY) ===== */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Gói hiện tại</span>
              <span>{account.activePackageType ?? "Chưa có"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span>{formatLocalDateTime(account.createdAt)}</span>
            </div>

            {account.lastSeenAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Hoạt động gần nhất</span>
                <span>{formatLocalDateTime(account.lastSeenAt)}</span>
              </div>
            )}
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
            className={`bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50`}
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
