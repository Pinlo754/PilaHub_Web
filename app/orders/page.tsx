"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useOrders } from "./useOrders";
import SearchSection from "./_components/SearchSection";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Pagination from "./_components/Pagination";
import OrderTable from "./_components/OrderTable";
import DetailModal from "./_components/DetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";

export default function OrdersPage() {
  const {
    pagedOrders,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedOrder,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handlePayout,
    statusFilter,
    setStatusFilter,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useOrders();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Đơn hàng" iconName="orders" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
            />

            <div className="overflow-x-auto">
              <OrderTable
                orders={pagedOrders}
                onPressOrder={handleOpenModal}
                onPayout={handlePayout}
                pageOffset={currentPage * 12}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {selectedOrder && (
        <DetailModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          order={selectedOrder}
          onPayout={handlePayout}
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
