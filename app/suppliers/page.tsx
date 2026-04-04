"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useSuppliers } from "./useSuppliers";
import SearchSection from "./_components/SearchSection";
import VendorTable from "./_components/VendorTable";
import Pagination from "./_components/Pagination";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import VerifyModal from "./_components/VerifyModal";

export default function SuppliersPage() {
  // HOOK
  const {
    currentPage,
    isLoading,
    searchTerm,
    setSearchTerm,
    vendors,
    onPressVendor,
    isVerifyModalOpen,
    onCloseVerifyModal,
    selectedVendor,
    verifyVendor,
  } = useSuppliers();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Nhà cung cấp" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Search and Filter */}
            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            {/* Table */}
            <div className="overflow-x-auto">
              <VendorTable vendors={vendors} onPressVendor={onPressVendor} />
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </main>
      </div>

      {/* Verify Modal */}
      <VerifyModal
        open={isVerifyModalOpen}
        onOpenChange={onCloseVerifyModal}
        vendor={selectedVendor}
        onVerify={verifyVendor}
      />
    </div>
  );
}
