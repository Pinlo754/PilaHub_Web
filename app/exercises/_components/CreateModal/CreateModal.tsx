"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { ExerciseService } from "@/hooks/exercise.service";
import { TutorialService } from "@/hooks/tutorial.service";
import { ExerciseEquipmentService } from "@/hooks/exerciseEquipment.service";
import { CreateExerciseReq } from "@/utils/ExerciseType";
import { useToast } from "@/hooks/useToast";
import ExerciseForm from "./ExerciseForm";
import TutorialForm from "./TutorialForm";
import EquipmentForm from "./EquipmentForm";

export type StagedEquipment = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  required: boolean;
  alternative: boolean;
  quantity: number;
  usageNotes: string;
};

export type TutorialFormData = {
  practiceVideoUrl: string;
  theoryVideoUrl: string;
  commonMistakes: string;
  guidelines: string;
  breathingTechnique: string;
  published: boolean;
};

export const EMPTY_TUTORIAL: TutorialFormData = {
  practiceVideoUrl: "",
  theoryVideoUrl: "",
  commonMistakes: "",
  guidelines: "",
  breathingTechnique: "",
  published: false,
};

const STEPS = [
  { key: "exercise", label: "Bài tập" },
  { key: "tutorial", label: "Hướng dẫn" },
  { key: "equipment", label: "Thiết bị" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const isExerciseValid = (form: Partial<CreateExerciseReq>) =>
  !!form.name?.trim() &&
  !!form.description?.trim() &&
  !!form.exerciseType &&
  !!form.difficultyLevel &&
  !!form.imageUrl;

const isTutorialValid = (form: TutorialFormData) =>
  !!form.guidelines?.trim() ||
  !!form.commonMistakes?.trim() ||
  !!form.breathingTechnique?.trim() ||
  !!form.theoryVideoUrl?.trim() ||
  !!form.practiceVideoUrl?.trim();

const CreateModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const [step, setStep] = useState<StepKey>("exercise");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<Partial<CreateExerciseReq>>({});
  const [tutorialForm, setTutorialForm] = useState<TutorialFormData>(EMPTY_TUTORIAL);
  const [stagedEquipments, setStagedEquipments] = useState<StagedEquipment[]>([]);
  const { showError } = useToast();

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  const handleClose = () => {
    setStep("exercise");
    setExerciseForm({});
    setTutorialForm(EMPTY_TUTORIAL);
    setStagedEquipments([]);
    onOpenChange(false);
  };

  const canGoNext = () => {
    if (step === "exercise") return isExerciseValid(exerciseForm);
    if (step === "tutorial") return true; // tutorial optional, can skip
    return true;
  };

  const handleNext = () => {
    if (step === "exercise") {
      if (!isExerciseValid(exerciseForm)) {
        showError("Vui lòng điền đầy đủ thông tin bắt buộc: tên, mô tả, loại, độ khó và ảnh.");
        return;
      }
      setStep("tutorial");
    } else if (step === "tutorial") {
      setStep("equipment");
    }
  };

  const handleBack = () => {
    if (step === "tutorial") setStep("exercise");
    else if (step === "equipment") setStep("tutorial");
  };

  const handleSubmit = async () => {
    if (!isExerciseValid(exerciseForm)) {
      showError("Thông tin bài tập chưa đầy đủ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await ExerciseService.createExercise({
        name: exerciseForm.name!,
        description: exerciseForm.description!,
        exerciseType: exerciseForm.exerciseType!,
        difficultyLevel: exerciseForm.difficultyLevel!,
        imageUrl: exerciseForm.imageUrl!,
        bodyParts: exerciseForm.bodyParts ?? [],
        equipmentRequired: exerciseForm.equipmentRequired ?? false,
        benefits: exerciseForm.benefits ?? "",
        prerequisites: exerciseForm.prerequisites ?? null,
        contraindications: exerciseForm.contraindications ?? null,
        haveAIsupported: exerciseForm.haveAIsupported ?? false,
        nameInModelAI: exerciseForm.nameInModelAI ?? null,
        breathingRule: exerciseForm.breathingRule ?? null,
        duration: exerciseForm.duration ?? 0,
      });

      const exerciseId = created.exerciseId;

      if (isTutorialValid(tutorialForm)) {
        await TutorialService.createTutorial({ exerciseId, ...tutorialForm });
      }

      for (const eq of stagedEquipments) {
        await ExerciseEquipmentService.createExerciseEquipment({
          exerciseId,
          equipmentId: eq.equipmentId,
          required: eq.required,
          alternative: eq.alternative,
          quantity: eq.quantity,
          usageNotes: eq.usageNotes,
        });
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Tạo bài tập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="!max-w-4xl w-full !max-h-[92vh] flex flex-col rounded-2xl overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Tạo bài tập mới
          </DialogTitle>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-4">
            {STEPS.map((s, idx) => {
              const isActive = s.key === step;
              const isDone = idx < currentStepIdx;
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        isDone
                          ? "bg-orange-500 border-orange-500 text-white"
                          : isActive
                            ? "bg-white border-orange-500 text-orange-600"
                            : "bg-white border-gray-200 text-gray-400"
                      }`}
                    >
                      {isDone ? <Check size={14} /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-medium ${isActive ? "text-orange-600" : isDone ? "text-orange-500" : "text-gray-400"}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 ${isDone ? "bg-orange-300" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {step === "exercise" && (
            <ExerciseForm form={exerciseForm} onChange={setExerciseForm} />
          )}
          {step === "tutorial" && (
            <TutorialForm form={tutorialForm} onChange={setTutorialForm} />
          )}
          {step === "equipment" && (
            <EquipmentForm
              stagedEquipments={stagedEquipments}
              onChange={setStagedEquipments}
            />
          )}
        </div>

        <DialogFooter className="shrink-0 px-6 py-4 border-t flex items-center justify-between gap-3">
          <div>
            {step !== "exercise" && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft size={16} className="mr-1" />
                Quay lại
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Huỷ
            </Button>

            {step !== "equipment" ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"
              >
                Tiếp theo
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo bài tập"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;