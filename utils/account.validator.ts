import { RoleType } from "@/utils/AccountType";

export type AccountForm = {
  email: string;
  phoneNumber: string;
  role: RoleType;
  active: boolean;
};

export type AccountFormError = Partial<Record<keyof AccountForm, string>>;

export const validateAccountForm = (form: AccountForm): AccountFormError => {
  const errors: AccountFormError = {};

  // EMAIL
  if (!form.email) {
    errors.email = "Email không được để trống";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email không hợp lệ";
  }

  // PHONE
  if (!form.phoneNumber) {
    errors.phoneNumber = "Số điện thoại không được để trống";
  } else if (!/^[0-9]{9,11}$/.test(form.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }
  return errors;
};
