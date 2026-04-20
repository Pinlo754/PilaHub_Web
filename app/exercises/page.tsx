"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useExercises } from "./useExercises";
import SearchSection from "./_components/SearchSection";
import ExerciseTable from "./_components/ExerciseTable";
import DetailModal from "./_components/DetailModal/DetailModal";
import Pagination from "./_components/Pagination";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import CreateModal from "./_components/CreateModal/CreateModal";


export default function ExercisesPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    selectedExercise,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    openCreateModal,
    showCreateModal,
    closeCreateModal,
    paginated,
    toasts,
    removeToast,
    handleCreateSuccess,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useExercises();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

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
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <ExerciseTable
                exercises={paginated}
                onPressExercise={openDetailModal}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {selectedExercise && (
        <DetailModal
          key={selectedExercise.exerciseId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          exercise={selectedExercise}
        />
      )}

      <CreateModal
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
