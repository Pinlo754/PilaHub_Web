"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import CoachBookingTable from "./_components/CoachBookingTable";

import { useVideoCall } from "./useVideoCall";
import DetailModal from "./_components/DetailModal";
import Pagination from "./_components/Pagination";

export default function VideoCallPage() {
  const {
    bookings,
    isLoading,
    selectedBooking,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    markReady,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
    currentPage,
    totalPages,
    handlePageChange,
    paginated,
  } = useVideoCall();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Giả lập Video Call" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <div className="overflow-x-auto">
              <CoachBookingTable
                bookings={paginated}
                onPressBooking={openDetailModal}
                onMarkReady={markReady}
              />
            </div>

            {paginated.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <DetailModal
        open={showDetailModal}
        onOpenChange={(open) => !open && closeDetailModal()}
        booking={selectedBooking}
        onMarkReady={markReady}
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
