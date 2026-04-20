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

          {/* Row 1: Vendor info + Revenue */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <VendorDetail vendor={vendor} />
            <div className="col-span-2">
              <RevenueSection />
            </div>
          </div>

          {/* Row 2: Products + Orders (side by side, each scrolls internally) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <ProductTable
                productPage={productPage}
                currentPage={currentProductPage}
                onPageChange={handleProductPageChange}
              />
            </div>
            <div>
              <OrderSection
                orders={pagedOrders}
                currentPage={currentOrderPage}
                totalPages={totalOrderPages}
                onPageChange={handleOrderPageChange}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
