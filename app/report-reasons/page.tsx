"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ReportReasonTable from "./_components/ReportReasonTable";
import SearchSection from "./_components/SearchSection";
import DetailModal from "./_components/DetailModal";
import CreateModal from "./_components/CreateModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useReportReasons } from "./useReportReasons";
import Pagination from "./_components/Pagination";

export default function ReportReasonsPage() {
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
    createReportReason,
    updateReportReason,
    toggleActive,
    deleteReportReason,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useReportReasons();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Lý do báo cáo" iconName="reportReasons" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="overflow-x-auto">
              <ReportReasonTable
                items={paginated}
                startIndex={startIndex}
                onPress={openDetailModal}
                onToggleActive={toggleActive}
                onDelete={deleteReportReason}
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
          key={selected.reportReasonId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          onSubmit={updateReportReason}
        />
      )}

      {/* Create Modal */}
      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createReportReason}
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
