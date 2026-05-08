"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import { PurposeType } from "@/utils/PurposeType";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";
import { StepIndicator } from "./StepIndicator";
import {
  SupplementInfoStep,
  SupplementForm,
  SupplementFormError,
} from "./SupplementInfoStep";
import { IngredientsStep } from "./IngredientsStep";
import { PurposesStep } from "./PurposesStep";
import { IngredientEntry, IngredientEntryError } from "./IngredientRow";
import { PurposeEntry, PurposeEntryError } from "./PurposeRow";
import { Footer } from "./Footer";
import { CreateSupplementPayload } from "../../useSupplements";

// ─── Validate ────────────────────────────────────────────────────────────────

const validateSupplement = (f: SupplementForm): SupplementFormError => {
  const e: SupplementFormError = {};
  if (!f.name.trim()) e.name = "Tên không được để trống";
  if (!f.description.trim()) e.description = "Mô tả không được để trống";
  if (!f.brand.trim()) e.brand = "Thương hiệu không được để trống";
  if (!f.form.trim()) e.form = "Dạng sản phẩm không được để trống";
  return e;
};

const validateIngredient = (entry: IngredientEntry): IngredientEntryError => {
  const e: IngredientEntryError = {};
  if (!entry.ingredientId) e.ingredientId = "Chọn nguyên liệu";
  if (
    !entry.amount.trim() ||
    isNaN(Number(entry.amount)) ||
    Number(entry.amount) <= 0
  )
    e.amount = "Số lượng phải là số dương";
  if (!entry.unit.trim()) e.unit = "Đơn vị không được để trống";
  return e;
};

const validatePurpose = (entry: PurposeEntry): PurposeEntryError => {
  const e: PurposeEntryError = {};
  if (!entry.purposeId) e.purposeId = "Chọn mục đích";
  return e;
};

// ─── Types & constants ───────────────────────────────────────────────────────

type Step = "info" | "ingredients" | "purposes";

const INITIAL_FORM: SupplementForm = {
  name: "",
  description: "",
  brand: "",
  form: "",
  usageInstructions: "",
  benefits: "",
  sideEffects: "",
  contraindications: "",
  warnings: "",
  imageUrl: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allIngredients: IngredientType[];
  allPurposes: PurposeType[];
  rulesMap: Record<string, IngredientRuleType[]>;
  isModalDataLoading: boolean;
  onLoadRules: (ingredientId: string) => void;
  onSubmit: (
    payload: CreateSupplementPayload,
    uploadImage: (file: File) => Promise<string>,
  ) => Promise<boolean>;
};

// ─── Root modal ───────────────────────────────────────────────────────────────

const CreateModal = ({
  open,
  onOpenChange,
  allIngredients,
  allPurposes,
  rulesMap,
  isModalDataLoading,
  onLoadRules,
  onSubmit,
}: Props) => {
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState<SupplementForm>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<SupplementFormError>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SupplementForm, boolean>>
  >({});
  const [ingredientEntries, setIngredientEntries] = useState<IngredientEntry[]>(
    [],
  );
  const [ingredientErrors, setIngredientErrors] = useState<
    IngredientEntryError[]
  >([]);
  const [purposeEntries, setPurposeEntries] = useState<PurposeEntry[]>([]);
  const [purposeErrors, setPurposeErrors] = useState<PurposeEntryError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const { uploadImage, loading: uploading, progress } = useFirebaseUpload();

  // ── Form handlers ──
  const handleFormChange = <K extends keyof SupplementForm>(
    key: K,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validateSupplement(updated);
        setFormErrors((p) => {
          const n = { ...p };
          errs[key] ? (n[key] = errs[key]) : delete n[key];
          return n;
        });
      }
      return updated;
    });
  };

  const handleBlur = (key: keyof SupplementForm) => {
    setTouched((p) => ({ ...p, [key]: true }));
    const errs = validateSupplement(form);
    setFormErrors((p) => {
      const n = { ...p };
      errs[key] ? (n[key] = errs[key]) : delete n[key];
      return n;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Ingredient handlers ──
  const addIngredient = () => {
    setIngredientEntries((p) => [
      ...p,
      { ingredientId: "", amount: "", unit: "", notes: "" },
    ]);
    setIngredientErrors((p) => [...p, {}]);
  };
  const removeIngredient = (idx: number) => {
    setIngredientEntries((p) => p.filter((_, i) => i !== idx));
    setIngredientErrors((p) => p.filter((_, i) => i !== idx));
  };
  const updateIngredient = (
    idx: number,
    field: keyof IngredientEntry,
    value: string,
  ) => {
    setIngredientEntries((p) =>
      p.map((e, i) => (i === idx ? { ...e, [field]: value } : e)),
    );
    setIngredientErrors((p) =>
      p.map((e, i) => {
        if (i !== idx) return e;
        const errs = validateIngredient({
          ...ingredientEntries[idx],
          [field]: value,
        });
        const n = { ...e };
        errs[field] ? (n[field] = errs[field]) : delete n[field];
        return n;
      }),
    );
  };

  // ── Purpose handlers ──
  const addPurpose = () => {
    setPurposeEntries((p) => [
      ...p,
      { purposeId: "", primary: false, effectivenessNotes: "" },
    ]);
    setPurposeErrors((p) => [...p, {}]);
  };
  const removePurpose = (idx: number) => {
    setPurposeEntries((p) => p.filter((_, i) => i !== idx));
    setPurposeErrors((p) => p.filter((_, i) => i !== idx));
  };
  const updatePurpose = (
    idx: number,
    field: keyof PurposeEntry,
    value: any,
  ) => {
    setPurposeEntries((p) =>
      p.map((e, i) => (i === idx ? { ...e, [field]: value } : e)),
    );
  };

  // ── Step validation & navigation ──
  const validateStep = (): boolean => {
    if (step === "info") {
      const allTouched = Object.fromEntries(
        Object.keys(form).map((k) => [k, true]),
      ) as any;
      setTouched(allTouched);
      const errs = validateSupplement(form);
      setFormErrors(errs);
      return Object.keys(errs).length === 0;
    }
    if (step === "ingredients") {
      const errs = ingredientEntries.map(validateIngredient);
      setIngredientErrors(errs);
      return errs.every((e) => Object.keys(e).length === 0);
    }
    if (step === "purposes") {
      const errs = purposeEntries.map(validatePurpose);
      setPurposeErrors(errs);
      return errs.every((e) => Object.keys(e).length === 0);
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === "info") setStep("ingredients");
    else if (step === "ingredients") setStep("purposes");
  };

  const handleBack = () => {
    if (step === "purposes") setStep("ingredients");
    else if (step === "ingredients") setStep("info");
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    const success = await onSubmit(
      { form, imageFile, ingredientEntries, purposeEntries },
      uploadImage,
    );
    setIsSubmitting(false);
    if (success) handleClose(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep("info");
      setForm(INITIAL_FORM);
      setFormErrors({});
      setTouched({});
      setIngredientEntries([]);
      setIngredientErrors([]);
      setPurposeEntries([]);
      setPurposeErrors([]);
      setImageFile(null);
      setImagePreview("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-4xl rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Thêm thực phẩm chức năng
          </DialogTitle>
          <StepIndicator currentStep={step} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 pr-1">
          {isModalDataLoading ? (
            <div className="flex justify-center items-center py-10 text-orange-500">
              <Loader2 size={24} className="animate-spin mr-2" /> Đang tải dữ
              liệu...
            </div>
          ) : (
            <>
              {step === "info" && (
                <SupplementInfoStep
                  form={form}
                  errors={formErrors}
                  touched={touched}
                  imagePreview={imagePreview}
                  uploading={uploading}
                  progress={progress}
                  onChange={handleFormChange}
                  onBlur={handleBlur}
                  onFileChange={handleFileChange}
                />
              )}
              {step === "ingredients" && (
                <IngredientsStep
                  entries={ingredientEntries}
                  errors={ingredientErrors}
                  ingredients={allIngredients}
                  rulesMap={rulesMap}
                  onAdd={addIngredient}
                  onRemove={removeIngredient}
                  onChange={updateIngredient}
                  onLoadRules={onLoadRules}
                />
              )}
              {step === "purposes" && (
                <PurposesStep
                  entries={purposeEntries}
                  errors={purposeErrors}
                  purposes={allPurposes}
                  onAdd={addPurpose}
                  onRemove={removePurpose}
                  onChange={updatePurpose}
                />
              )}
            </>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Footer
            step={step}
            isSubmitting={isSubmitting}
            uploading={uploading}
            onCancel={() => handleClose(false)}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
