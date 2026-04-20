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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FitnessGoalType,
  CreateFitnessGoalReq,
  UpdateFitnessGoalReq,
} from "@/utils/FitnessGoalType";

// ---- FORM TYPE ----
type FitnessGoalForm = {
  code: string;
  vietnameseName: string;
  //   description: string;
  relatedPurposeIds: string;
};

type FitnessGoalFormError = Partial<Record<keyof FitnessGoalForm, string>>;

const validateForm = (form: FitnessGoalForm): FitnessGoalFormError => {
  const errors: FitnessGoalFormError = {};
  if (!form.code.trim()) errors.code = "Mã không được để trống";
  if (!form.vietnameseName.trim())
    errors.vietnameseName = "Tên tiếng Việt không được để trống";
  //   if (!form.description.trim())
  //     errors.description = "Mô tả không được để trống";
  return errors;
};

const parseIds = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ---- PROPS ----
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: FitnessGoalType | null;
  onCreate: (payload: CreateFitnessGoalReq) => void;
  onUpdate: (goalId: string, payload: UpdateFitnessGoalReq) => void;
};

const EMPTY_FORM: FitnessGoalForm = {
  code: "",
  vietnameseName: "",
  //   description: "",
  relatedPurposeIds: "",
};

const DetailModal = ({
  open,
  onOpenChange,
  goal,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditMode = !!goal;

  const [initialForm, setInitialForm] = useState<FitnessGoalForm | null>(null);
  const [form, setForm] = useState<FitnessGoalForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FitnessGoalForm, boolean>>
  >({});
  const [errors, setErrors] = useState<FitnessGoalFormError>({});

  // ---- COMPUTED ----
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(
      ([key]) => touched[key as keyof FitnessGoalForm],
    ),
  );
  const isValid =
    Object.keys(visibleErrors).length === 0 && Object.keys(errors).length === 0;

  const isDirty =
    !isEditMode ||
    (!!initialForm &&
      (form.code !== initialForm.code ||
        form.vietnameseName !== initialForm.vietnameseName ||
        // form.description !== initialForm.description ||
        form.relatedPurposeIds !== initialForm.relatedPurposeIds));

  // ---- HANDLERS ----
  const handleChange = <K extends keyof FitnessGoalForm>(
    key: K,
    value: FitnessGoalForm[K],
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

  const handleBlur = (key: keyof FitnessGoalForm) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateForm(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[key]) next[key] = errs[key];
      else delete next[key];
      return next;
    });
  };

  const touchAll = () => {
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FitnessGoalForm, boolean>,
    );
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    return errs;
  };

  const buildPayload = () => ({
    code: form.code,
    vietnameseName: form.vietnameseName,
    description: "Mô tả mặc định",
    relatedPurposeIds: parseIds(form.relatedPurposeIds),
  });

  const handleUpdate = () => {
    const errs = touchAll();
    if (Object.keys(errs).length > 0 || !isDirty) return;
    if (goal) onUpdate(goal.goalId, buildPayload());
  };

  const handleCreate = () => {
    const errs = touchAll();
    if (Object.keys(errs).length > 0) return;
    onCreate(buildPayload());
  };

  // ---- EFFECTS ----
  useEffect(() => {
    if (open) {
      if (goal) {
        const init: FitnessGoalForm = {
          code: goal.code,
          vietnameseName: goal.vietnameseName,
          //   description: goal.description ?? "",
          relatedPurposeIds: goal.relatedPurposeIds?.join(", ") ?? "",
        };
        setForm(init);
        setInitialForm(init);
      } else {
        setForm(EMPTY_FORM);
        setInitialForm(null);
      }
      setTouched({});
      setErrors({});
    }
  }, [open, goal]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            {isEditMode
              ? "Chi tiết mục tiêu thể lực"
              : "Tạo mục tiêu thể lực mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldGroup>
            {/* Code */}
            <Field>
              <Label>Mã</Label>
              <Input
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                onBlur={() => handleBlur("code")}
                placeholder="Nhập mã (ví dụ: WEIGHT_LOSS)"
              />
              {touched.code && errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </Field>

            {/* Vietnamese Name */}
            <Field>
              <Label>Tên tiếng Việt</Label>
              <Input
                value={form.vietnameseName}
                onChange={(e) => handleChange("vietnameseName", e.target.value)}
                onBlur={() => handleBlur("vietnameseName")}
                placeholder="Nhập tên tiếng Việt"
              />
              {touched.vietnameseName && errors.vietnameseName && (
                <p className="text-xs text-red-500">{errors.vietnameseName}</p>
              )}
            </Field>

            {/* Description */}
            {/* <Field>
              <Label>Mô tả</Label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Nhập mô tả"
                className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </Field> */}

            {/* Related Purpose IDs */}
            <Field>
              <Label>ID mục đích liên quan</Label>
              <Input
                value={form.relatedPurposeIds}
                onChange={(e) =>
                  handleChange("relatedPurposeIds", e.target.value)
                }
                onBlur={() => handleBlur("relatedPurposeIds")}
                placeholder="Nhập các ID, phân cách bởi dấu phẩy"
              />
              <p className="text-xs text-gray-400">Ví dụ: id-1, id-2, id-3</p>
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>

          {/* Always show Create button */}
          <Button
            onClick={handleCreate}
            disabled={!isValid && Object.keys(touched).length > 0}
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-200 hover:text-blue-700 disabled:opacity-50"
          >
            Tạo mới
          </Button>

          {/* Show Update only in edit mode, active when dirty */}
          {isEditMode && (
            <Button
              onClick={handleUpdate}
              disabled={!isDirty || !isValid}
              variant="outline"
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              Lưu thay đổi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
