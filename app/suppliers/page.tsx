"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useSuppliers } from "./useSuppliers";
import SearchSection from "./_components/SearchSection";
import VendorTable from "./_components/VendorTable";
import Pagination from "./_components/Pagination";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import VerifyModal from "./_components/VerifyModal";
import Tabs from "../accounts/_components/Tabs";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";

export default function SuppliersPage() {
  // HOOK
  const {
    currentPage,
    isLoading,
    searchTerm,
    setSearchTerm,
    onPressVendor,
    isVerifyModalOpen,
    onCloseVerifyModal,
    selectedVendor,
    verifyVendor,
    unverifyVendor,
    toasts,
    removeToast,
    closeConfirm,
    confirmState,
    handlePageChange,
    totalPages,
    paginated,
    startIndex,
    isConfirmOpen,
  } = useSuppliers();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Tài khoản" iconName="accounts" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Tabs */}
            <Tabs activeKey="VENDOR" />

            {/* Search and Filter */}
            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            {/* Table */}
            <div className="overflow-x-auto">
              <VendorTable
                vendors={paginated}
                startIndex={startIndex}
                onPressVendor={onPressVendor}
              />
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {/* Verify Modal */}
      <VerifyModal
        open={isVerifyModalOpen}
        onOpenChange={onCloseVerifyModal}
        vendor={selectedVendor}
        onVerify={verifyVendor}
        onUnverify={unverifyVendor}
      />

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
