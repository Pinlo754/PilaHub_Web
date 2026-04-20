"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { useExerciseDetail } from "./useExerciseDetail";
import ExerciseSection from "./_components/ExerciseSection";
import TutorialSection from "./_components/TutorialSection";
import EquipmentSection from "./_components/EquipmentSection";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ExerciseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    exercise,
    tutorial,
    pagedEquipments,
    equipments,
    exerciseDraft,
    tutorialDraft,
    updateExerciseDraft,
    updateTutorialDraft,
    isDirty,
    isExerciseLoading,
    isTutorialLoading,
    isEquipmentLoading,
    isSaving,
    currentEquipPage,
    totalEquipPages,
    handleEquipPageChange,
    handleSave,
    handleAddEquipment,
    handleDeleteEquipment,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useExerciseDetail({ exerciseId: id });

  return (
    <div className="flex h-screen bg-orange-50">
      {isExerciseLoading && <LoadingOverlay />}

      <Toast toasts={toasts} onRemove={removeToast} />

      {confirmState && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={(open) => !open && closeConfirm()}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          variant={confirmState.variant}
          onConfirm={confirmState.onConfirm}
        />
      )}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Bài tập" />
        <main className="flex-1 overflow-hidden p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/exercises"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <ChevronLeft size={20} />
              <span>Quay lại</span>
            </Link>

            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>

          {exercise && (
            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
              <div className="col-span-1">
                <ExerciseSection
                  exercise={exercise}
                  draft={exerciseDraft}
                  onDraftChange={updateExerciseDraft}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-4 min-h-0">
                <div className="flex-1 min-h-0" style={{ flex: "2" }}>
                  <TutorialSection
                    tutorial={tutorial}
                    draft={tutorialDraft}
                    onDraftChange={updateTutorialDraft}
                    isLoading={isTutorialLoading}
                  />
                </div>

                <div className="flex-1 min-h-0" style={{ flex: "1" }}>
                  <EquipmentSection
                    exercise={exercise}
                    equipments={equipments}
                    pagedEquipments={pagedEquipments}
                    isLoading={isEquipmentLoading}
                    currentPage={currentEquipPage}
                    totalPages={totalEquipPages}
                    onPageChange={handleEquipPageChange}
                    onAdd={handleAddEquipment}
                    onDelete={handleDeleteEquipment}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
