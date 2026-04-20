"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFitnessGoals } from "./useGoals";
import SearchSection from "./_components/SearchSection";
import FitnessGoalTable from "./_components/FitnessGoalTable";
import Pagination from "./_components/Pagination";
import DetailModal from "./_components/DetailModal";

export default function FitnessGoalsPage() {
  const {
    fitnessGoals,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    selectedGoal,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createFitnessGoal,
    updateFitnessGoal,
    updateStatusFitnessGoal,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
  } = useFitnessGoals();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Mục tiêu tập luyện" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <FitnessGoalTable
                fitnessGoals={fitnessGoals}
                onPressFitnessGoal={openDetailModal}
                updateStatusFitnessGoal={updateStatusFitnessGoal}
              />
            </div>

            <Pagination
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>

      {/* Detail / Edit Modal */}
      {selectedGoal && (
        <DetailModal
          key={selectedGoal.goalId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          goal={selectedGoal}
          onCreate={createFitnessGoal}
          onUpdate={updateFitnessGoal}
        />
      )}

      {/* Create Modal */}
      <DetailModal
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        goal={null}
        onCreate={createFitnessGoal}
        onUpdate={updateFitnessGoal}
      />

      {/* Confirm Dialog */}
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

      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
