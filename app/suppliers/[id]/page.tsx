"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSupplierDetail } from "./useSupplierDetail";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import VendorDetail from "./_components/VendorDetail";
import { useParams } from "next/navigation";
import RevenueSection from "./_components/RevenueSection";
import ProductTable from "./_components/ProductTable";
import CertificateSection from "./_components/CertificateSection";
import RatingSection from "./_components/RatingSection";
import OrderSection from "./_components/OrderSection";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import ProductDetailModal from "./_components/ProductDetailModal";
import OrderDetailModal from "./_components/OrderDetailModal";

export default function SupplierDetailsPage() {
  // PARAM
  const params = useParams();
  const id = params.id as string;

  // HOOK
  const {
    vendor,
    isLoading,
    currentOrderPage,
    currentProductPage,
    handleOrderPageChange,
    handleProductPageChange,
    pagedOrders,
    productPage,
    totalOrderPages,
    // product search
    productSearchTerm,
    handleProductSearch,
    // product modal
    selectedProduct,
    productModalOpen,
    handleOpenProductModal,
    handleCloseProductModal,
    // order modal
    selectedOrder,
    orderModalOpen,
    handleOpenOrderModal,
    handleCloseOrderModal,
    // rule violation
    handleUpdateRuleViolation,
    // toast & confirm
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useSupplierDetail({ vendorId: id });

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Nhà cung cấp" />
        <main className="flex-1 overflow-hidden p-6">
          <Link
            href="/suppliers"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>

          <div className="grid grid-cols-3 gap-4">
            {/* Col 1: Vendor info + Order Section */}
            <div className="col-span-1 flex flex-col gap-4">
              <VendorDetail vendor={vendor} />
              {/* Order Section */}
              <OrderSection
                orders={pagedOrders}
                currentPage={currentOrderPage}
                totalPages={totalOrderPages}
                onPageChange={handleOrderPageChange}
                onRowClick={handleOpenOrderModal}
              />
              {/* <div className="col-span-2">
              <RevenueSection />
            </div> */}
            </div>

            {/* Col 2: Product */}
            <div className="col-span-2">
              <ProductTable
                productPage={productPage}
                currentPage={currentProductPage}
                onPageChange={handleProductPageChange}
                searchTerm={productSearchTerm}
                onSearch={handleProductSearch}
                onRowClick={handleOpenProductModal}
                onUpdateRuleViolation={handleUpdateRuleViolation}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={productModalOpen}
        onOpenChange={handleCloseProductModal}
        product={selectedProduct}
        onUpdateRuleViolation={handleUpdateRuleViolation}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        open={orderModalOpen}
        onOpenChange={handleCloseOrderModal}
        order={selectedOrder}
      />

      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Confirm */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={(open) => !open && closeConfirm()}
        title={confirmState?.title ?? ""}
        description={confirmState?.description}
        confirmLabel={confirmState?.confirmLabel}
        variant={confirmState?.variant}
        onConfirm={confirmState?.onConfirm ?? (() => {})}
      />
    </div>
  );
}
