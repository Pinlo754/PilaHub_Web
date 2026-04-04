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
        <main className="flex-1 overflow-auto p-6">
          <Link
            href="/suppliers"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>

          <div className="grid grid-cols-3 space-x-4">
            {/* Col 1 */}
            <div className="space-y-2">
              {/* Supplier Info */}
              <VendorDetail vendor={vendor} />

              {/* Revenue */}
              <RevenueSection />

              {/* Order */}
              <OrderSection
                orders={pagedOrders}
                currentPage={currentOrderPage}
                totalPages={totalOrderPages}
                onPageChange={handleOrderPageChange}
              />
            </div>

            {/* Col 2 */}
            <div className="space-y-2 col-span-2">
              {/* Product Catalog */}
              <ProductTable
                productPage={productPage}
                currentPage={currentProductPage}
                onPageChange={handleProductPageChange}
              />

              {/* Certi and Ratings */}

              <div className="grid grid-cols-2 space-x-2">
                {/* Certificates */}
                <CertificateSection />

                {/* Rating */}
                <RatingSection />
              </div>

              {/* Status Info
              <div className="bg-white rounded-2xl border-2 border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">
                  Vị trí: Đang hoạt động
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Số dư: 9.876.000 VND
                </p>
                <button className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                  Xem chi tiết →
                </button>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
