"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import BodyPartTable from "./_components/BodyPartTable";
import SearchSection from "./_components/SearchSection";
import DetailModal from "./_components/DetailModal";
import CreateModal from "./_components/CreateModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useBodyParts } from "./useBodyParts";
import Pagination from "./_components/Pagination";

export default function BodyPartsPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    paginated,
    startIndex,
    selectedBodyPart,
    showDetailModal,
    showCreateModal,
    setShowCreateModal,
    openDetailModal,
    closeDetailModal,
    createBodyPart,
    updateBodyPart,
    deleteBodyPart,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useBodyParts();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Bộ phận cơ thể" iconName="bodyParts" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="overflow-x-auto">
              <BodyPartTable
                bodyParts={paginated}
                startIndex={startIndex}
                onPress={openDetailModal}
                onDelete={deleteBodyPart}
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
      {selectedBodyPart && (
        <DetailModal
          key={selectedBodyPart.bodyPartId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          bodyPart={selectedBodyPart}
          onSubmit={updateBodyPart}
        />
      )}

      {/* Create Modal */}
      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createBodyPart}
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
