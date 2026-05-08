"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import GHNTable from "./_components/GHNTable";
import { useGHNSimulator } from "./useGHNSimulator";
import DetailModal from "./_components/DetailModal";
import Pagination from "./_components/Pagination";

export default function GHNSimulatorPage() {
  const {
    isLoading,
    paginated,
    startIndex,
    currentPage,
    totalPages,
    handlePageChange,
    selected,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    markAsDelivered,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useGHNSimulator();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Giả lập GHN" iconName="ghn" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <div className="overflow-x-auto">
              <GHNTable
                items={paginated}
                startIndex={startIndex}
                onPress={openDetailModal}
                onMarkDelivered={markAsDelivered}
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
          key={selected.orderId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          onMarkDelivered={markAsDelivered}
        />
      )}

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
