"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ReturnReasonTable from "./_components/ReturnReasonTable";
import SearchSection from "./_components/SearchSection";
import DetailModal from "./_components/DetailModal";
import CreateModal from "./_components/CreateModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useReturnReasons } from "./useReturnReasons";
import Pagination from "./_components/Pagination";

export default function ReturnReasonsPage() {
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
    createReturnReason,
    updateReturnReason,
    deleteReturnReason,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useReturnReasons();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Lý do hoàn trả" iconName="returnReasons" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="overflow-x-auto">
              <ReturnReasonTable
                items={paginated}
                startIndex={startIndex}
                onPress={openDetailModal}
                onDelete={deleteReturnReason}
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
          key={selected.reasonId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          onSubmit={updateReturnReason}
        />
      )}

      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createReturnReason}
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
