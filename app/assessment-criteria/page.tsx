"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import AssessmentCriterionTable from "./_components/AssessmentCriterionTable";
import SearchSection from "./_components/SearchSection";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useAssessmentCriteria } from "./useAssessmentCriteria";
import Pagination from "./_components/Pagination";
import DetailModal from "./_components/DetailModal";
import CreateModal from "./_components/CreateModal";

export default function AssessmentCriteriaPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    paginated,
    startIndex,
    selected,
    showDetailModal,
    showCreateModal,
    setShowCreateModal,
    openDetailModal,
    closeDetailModal,
    createCriterion,
    updateCriterion,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useAssessmentCriteria();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Tiêu chí đánh giá" iconName="assessmentCriteria" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="overflow-x-auto">
              <AssessmentCriterionTable
                items={paginated}
                startIndex={startIndex}
                onPress={openDetailModal}
                onToggleActive={toggleActive}
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

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          key={selected.assessmentCriterionId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          onSubmit={updateCriterion}
        />
      )}

      {/* Create Modal */}
      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createCriterion}
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

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}