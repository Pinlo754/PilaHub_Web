"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { usePurposes } from "./usePurposes";
import SearchSection from "./_components/SearchSection";
import PurposeTable from "./_components/PurposeTable";
import Pagination from "./_components/Pagination";
import DetailModal from "./_components/DetailModal";
import CreateModal from "./_components/CreateModal";

export default function PurposesPage() {
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
    createPurpose,
    updatePurpose,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = usePurposes();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Mục đích" iconName="purposes" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="overflow-x-auto">
              <PurposeTable
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

      {selected && (
        <DetailModal
          key={selected.purposeId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          onSubmit={updatePurpose}
        />
      )}

      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createPurpose}
      />

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
