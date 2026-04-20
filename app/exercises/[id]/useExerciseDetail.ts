"use client";

import { useEffect, useState, useCallback } from "react";
import { ExerciseType, UpdateExerciseReq } from "@/utils/ExerciseType";
import { ExerciseEquipmentType } from "@/utils/ExerciseEquipmentType";
import { TutorialService } from "@/hooks/tutorial.service";
import { ExerciseEquipmentService } from "@/hooks/exerciseEquipment.service";
import { ExerciseService } from "@/hooks/exercise.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { TutorialType, UpdateTutorialReq } from "@/utils/TutorialType";

const EQUIP_PER_PAGE = 5;

type Props = { exerciseId: string };

export const useExerciseDetail = ({ exerciseId }: Props) => {
  // ── Raw server data ────────────────────────────────────────────────────────
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [tutorial, setTutorial] = useState<TutorialType | null>(null);
  const [equipments, setEquipments] = useState<ExerciseEquipmentType[]>([]);

  // ── Draft (editable) ───────────────────────────────────────────────────────
  const [exerciseDraft, setExerciseDraft] = useState<UpdateExerciseReq>({});
  const [tutorialDraft, setTutorialDraft] = useState<
    Partial<UpdateTutorialReq>
  >({});

  // ── Dirty flags ────────────────────────────────────────────────────────────
  const [exerciseDirty, setExerciseDirty] = useState(false);
  const [tutorialDirty, setTutorialDirty] = useState(false);
  const isDirty = exerciseDirty || tutorialDirty;

  // ── Loading ────────────────────────────────────────────────────────────────
  const [isExerciseLoading, setIsExerciseLoading] = useState(true);
  const [isTutorialLoading, setIsTutorialLoading] = useState(false);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Equipment pagination ───────────────────────────────────────────────────
  const [currentEquipPage, setCurrentEquipPage] = useState(1);
  const totalEquipPages = Math.max(
    1,
    Math.ceil(equipments.length / EQUIP_PER_PAGE),
  );
  const pagedEquipments = equipments.slice(
    (currentEquipPage - 1) * EQUIP_PER_PAGE,
    currentEquipPage * EQUIP_PER_PAGE,
  );

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchExercise = useCallback(async () => {
    setIsExerciseLoading(true);
    try {
      const ex = await ExerciseService.getById(exerciseId);
      setExercise(ex);
      // Init draft
      setExerciseDraft({
        name: ex.name,
        description: ex.description,
        imageUrl: ex.imageUrl,
        exerciseType: ex.exerciseType,
        difficultyLevel: ex.difficultyLevel,
        bodyParts: ex.bodyParts?.map((b) => b.name) ?? [],
        equipmentRequired: ex.equipmentRequired,
        benefits: ex.benefits,
        prerequisites: ex.prerequisites,
        contraindications: ex.contraindications,
        haveAIsupported: ex.haveAIsupported,
        nameInModelAI: ex.nameInModelAI,
        breathingRule: ex.breathingRule,
        duration: ex.duration,
      });
      setExerciseDirty(false);
    } finally {
      setIsExerciseLoading(false);
    }
  }, [exerciseId]);

  const fetchTutorial = useCallback(async () => {
    setIsTutorialLoading(true);
    try {
      const tut = await TutorialService.getById(exerciseId);
      setTutorial(tut);
      setTutorialDraft({
        practiceVideoUrl: tut.practiceVideoUrl,
        theoryVideoUrl: tut.theoryVideoUrl,
        commonMistakes: tut.commonMistakes,
        guidelines: tut.guidelines,
        breathingTechnique: tut.breathingTechnique,
        published: tut.published,
      });
      setTutorialDirty(false);
    } catch {
      setTutorial(null);
    } finally {
      setIsTutorialLoading(false);
    }
  }, [exerciseId]);

  const fetchEquipments = useCallback(async () => {
    setIsEquipmentLoading(true);
    try {
      const eq = await ExerciseEquipmentService.getById(exerciseId);
      setEquipments(eq);
    } catch {
      setEquipments([]);
    } finally {
      setIsEquipmentLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    if (!exerciseId) return;
    fetchExercise();
    fetchTutorial();
    fetchEquipments();
  }, [exerciseId]);

  // ── Draft updaters ─────────────────────────────────────────────────────────
  const updateExerciseDraft = (patch: Partial<UpdateExerciseReq>) => {
    setExerciseDraft((prev) => ({ ...prev, ...patch }));
    setExerciseDirty(true);
  };

  const updateTutorialDraft = (patch: Partial<UpdateTutorialReq>) => {
    setTutorialDraft((prev) => ({ ...prev, ...patch }));
    setTutorialDirty(true);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!exercise) return;
    setIsSaving(true);
    try {
      if (exerciseDirty) {
        await ExerciseService.updateExercise(exerciseId, exerciseDraft);
        setExerciseDirty(false);
      }

      if (tutorialDirty && tutorial) {
        await TutorialService.updateTutorial(
          tutorial.tutorialId,
          tutorialDraft as UpdateTutorialReq,
        );
        setTutorialDirty(false);
      } else if (tutorialDirty && !tutorial) {
        // Create tutorial if didn't exist
        await TutorialService.createTutorial({
          exerciseId,
          practiceVideoUrl: tutorialDraft.practiceVideoUrl ?? "",
          theoryVideoUrl: tutorialDraft.theoryVideoUrl ?? "",
          commonMistakes: tutorialDraft.commonMistakes ?? "",
          guidelines: tutorialDraft.guidelines ?? "",
          breathingTechnique: tutorialDraft.breathingTechnique ?? "",
          published: tutorialDraft.published ?? false,
        });
        setTutorialDirty(false);
      }

      await fetchExercise();
      await fetchTutorial();
      showSuccess("Lưu thay đổi thành công!");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Lưu thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Equipment actions ──────────────────────────────────────────────────────
  const handleAddEquipment = async (payload: {
    equipmentId: string;
    equipmentName: string;
    required: boolean;
    alternative: boolean;
    quantity: number;
    usageNotes: string;
  }) => {
    try {
      await ExerciseEquipmentService.createExerciseEquipment({
        exerciseId,
        equipmentId: payload.equipmentId,
        required: payload.required,
        alternative: payload.alternative,
        quantity: payload.quantity,
        usageNotes: payload.usageNotes,
      });
      await fetchEquipments();
      showSuccess("Đã thêm thiết bị.");
    } catch (err: any) {
      showError(
        err?.type === "BUSINESS_ERROR" ? err.message : "Thêm thiết bị thất bại",
      );
    }
  };

  const handleDeleteEquipment = (exerciseEquipmentId: string, name: string) => {
    confirm({
      title: "Xoá thiết bị?",
      description: `Xoá "${name}" khỏi bài tập này?`,
      variant: "danger",
      confirmLabel: "Xoá",
      onConfirm: async () => {
        try {
          await ExerciseEquipmentService.deleteExerciseEquipment(
            exerciseEquipmentId,
          );
          await fetchEquipments();
          showSuccess("Đã xoá thiết bị.");
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Xoá thất bại",
          );
        }
      },
    });
  };

  return {
    // Data
    exercise,
    tutorial,
    pagedEquipments,
    equipments,
    // Draft
    exerciseDraft,
    tutorialDraft,
    updateExerciseDraft,
    updateTutorialDraft,
    isDirty,
    // Loading
    isExerciseLoading,
    isTutorialLoading,
    isEquipmentLoading,
    isSaving,
    // Pagination
    currentEquipPage,
    totalEquipPages,
    handleEquipPageChange: setCurrentEquipPage,
    // Actions
    handleSave,
    handleAddEquipment,
    handleDeleteEquipment,
    // Toast & Confirm
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
