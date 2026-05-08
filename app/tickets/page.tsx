"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useTickets } from "./useTickets";
import FilterSection from "./_components/FilterSection";
import TicketTable from "./_components/TicketTable";
import Pagination from "./_components/Pagination";
import DetailModal from "./_components/DetailModal";

export default function TicketsPage() {
  const {
    isLoading,
    statusFilter,
    setStatusFilter,
    totalPages,
    handlePageChange,
    currentPage,
    paginated,
    vendorMap,
    startIndex,
    selected,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    approveTicket,
    rejectTicket,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useTickets();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Đơn hỗ trợ" iconName="tickets" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <FilterSection
              statusFilter={statusFilter}
              onChange={setStatusFilter}
            />

            <div className="overflow-x-auto">
              <TicketTable
                items={paginated}
                vendorMap={vendorMap}
                startIndex={startIndex}
                onPress={openDetailModal}
                onApprove={approveTicket}
                onReject={rejectTicket}
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
          key={selected.ticketId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          item={selected}
          vendor={vendorMap[selected.accountId]}
          onApprove={approveTicket}
          onReject={rejectTicket}
        />
      )}

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
