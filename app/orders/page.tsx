"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useOrders } from "./useOrders";
import SearchSection from "./_components/SearchSection";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Pagination from "./_components/Pagination";
import OrderTable from "./_components/OrderTable";
import DetailModal from "./_components/DetailModal";

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
  } = useOrders();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Đơn hàng" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            <div className="overflow-x-auto">
              <OrderTable
                orders={pagedOrders}
                onPressOrder={handleOpenModal}
                onPayout={handlePayout}
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
    </div>
  );
}
