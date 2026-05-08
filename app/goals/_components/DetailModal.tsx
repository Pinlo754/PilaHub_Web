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
import { X, Plus } from "lucide-react";
import {
  FitnessGoalType,
  CreateFitnessGoalReq,
  UpdateFitnessGoalReq,
  PurposeType,
} from "@/utils/FitnessGoalType";

// ---- FORM TYPE ----
type FitnessGoalForm = {
  code: string;
  vietnameseName: string;
  selectedPurposeIds: string[]; // danh sách purposeId đã chọn
};

type FitnessGoalFormError = Partial<Record<keyof FitnessGoalForm, string>>;

const validateForm = (form: FitnessGoalForm): FitnessGoalFormError => {
  const errors: FitnessGoalFormError = {};
  if (!form.code.trim()) errors.code = "Mã không được để trống";
  if (!/^[A-Z0-9_]+$/.test(form.code.trim()))
    errors.code = "Mã chỉ gồm chữ HOA, số và dấu _ (ví dụ: BACK_PAIN_RELIEF)";
  if (!form.vietnameseName.trim())
    errors.vietnameseName = "Tên tiếng Việt không được để trống";
  return errors;
};

const EMPTY_FORM: FitnessGoalForm = {
  code: "",
  vietnameseName: "",
  selectedPurposeIds: [],
};

// ---- PROPS ----
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: FitnessGoalType | null;
  purposes: PurposeType[]; // danh sách tất cả purpose từ hook cha
  onCreate: (payload: CreateFitnessGoalReq) => Promise<void>;
  onUpdate: (goalId: string, payload: UpdateFitnessGoalReq) => Promise<void>;
};

const DetailModal = ({
  open,
  onOpenChange,
  goal,
  purposes,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Select đang chọn để thêm vào list
  const [pendingPurposeId, setPendingPurposeId] = useState<string>("");

  // ---- COMPUTED ----
  const isValid = Object.keys(errors).length === 0;

  const isDirty =
    !isEditMode ||
    (!!initialForm &&
      (form.code !== initialForm.code ||
        form.vietnameseName !== initialForm.vietnameseName ||
        JSON.stringify([...form.selectedPurposeIds].sort()) !==
          JSON.stringify([...initialForm.selectedPurposeIds].sort())));

  // Những purpose chưa được chọn (dùng cho dropdown thêm mới)
  const availablePurposes = purposes.filter(
    (p) => !form.selectedPurposeIds.includes(p.purposeId),
  );

  // ---- FIELD HANDLERS ----
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

  // ---- PURPOSE LIST HANDLERS ----
  const handleAddPurpose = () => {
    if (!pendingPurposeId) return;
    // Validate trùng (dù đã filter availablePurposes, guard thêm)
    if (form.selectedPurposeIds.includes(pendingPurposeId)) return;
    handleChange("selectedPurposeIds", [
      ...form.selectedPurposeIds,
      pendingPurposeId,
    ]);
    setPendingPurposeId("");
  };

  const handleRemovePurpose = (id: string) => {
    handleChange(
      "selectedPurposeIds",
      form.selectedPurposeIds.filter((pid) => pid !== id),
    );
  };

  // ---- SUBMIT ----
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

  const buildPayload = (): CreateFitnessGoalReq => ({
    code: form.code.trim().toUpperCase(),
    vietnameseName: form.vietnameseName.trim(),
    description: "",
    relatedPurposeIds: form.selectedPurposeIds,
  });

  const handleUpdate = async () => {
    const errs = touchAll();
    if (Object.keys(errs).length > 0 || !isDirty) return;
    if (!goal) return;
    setIsSubmitting(true);
    try {
      await onUpdate(goal.goalId, buildPayload());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    const errs = touchAll();
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await onCreate(buildPayload());
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- EFFECTS ----
  useEffect(() => {
    if (open) {
      if (goal) {
        const init: FitnessGoalForm = {
          code: goal.code,
          vietnameseName: goal.vietnameseName,
          selectedPurposeIds:
            goal.relatedPurposes?.map((p) => p.purposeId) ?? [],
        };
        setForm(init);
        setInitialForm(init);
      } else {
        setForm(EMPTY_FORM);
        setInitialForm(null);
      }
      setTouched({});
      setErrors({});
      setIsSubmitting(false);
      setPendingPurposeId("");
    }
  }, [open, goal]);

  return (
    <Dialog open={open} onOpenChange={(o) => !isSubmitting && onOpenChange(o)}>
      <DialogContent className="!max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            {isEditMode
              ? "Chi tiết mục tiêu tập luyện"
              : "Tạo mục tiêu tập luyện mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto p-1">
          <FieldGroup>
            {/* Code */}
            <Field>
              <Label>
                Mã <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
                onBlur={() => handleBlur("code")}
                placeholder="VD: BACK_PAIN_RELIEF"
                className="font-mono"
              />
              {touched.code && errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </Field>

            {/* Vietnamese Name */}
            <Field>
              <Label>
                Tên tiếng Việt <span className="text-red-500">*</span>
              </Label>
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

            {/* Related Purposes */}
            <Field>
              <Label>Mục đích liên quan</Label>

              {/* Dropdown thêm purpose */}
              <div className="flex gap-2 mt-1">
                <select
                  value={pendingPurposeId}
                  onChange={(e) => setPendingPurposeId(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">— Chọn mục đích —</option>
                  {availablePurposes.map((p) => (
                    <option key={p.purposeId} value={p.purposeId}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPurpose}
                  disabled={!pendingPurposeId}
                  className="shrink-0 border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-40"
                >
                  <Plus size={16} />
                </Button>
              </div>

              {/* Danh sách đã chọn */}
              {form.selectedPurposeIds.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {form.selectedPurposeIds.map((id) => {
                    const p = purposes.find((p) => p.purposeId === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100"
                      >
                        <span className="text-sm text-orange-800 font-medium">
                          {p?.name ?? id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePurpose(id)}
                          className="ml-2 p-0.5 rounded text-orange-400 hover:text-red-500 hover:bg-red-50 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-400">
                  Chưa có mục đích nào được chọn
                </p>
              )}
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="pt-3 border-t mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Huỷ
          </Button>

          {/* Ẩn nút Tạo mới khi đang ở edit mode */}
          {!isEditMode && (
            <Button
              onClick={handleCreate}
              disabled={
                (!isValid && Object.keys(touched).length > 0) || isSubmitting
              }
              variant="outline"
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo mục tiêu"}
            </Button>
          )}

          {isEditMode && (
            <Button
              onClick={handleUpdate}
              disabled={!isDirty || !isValid || isSubmitting}
              variant="outline"
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
