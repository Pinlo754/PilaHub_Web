"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import PackageTable from "./_components/PackageTable";
import Pagination from "./_components/Pagination";
import SearchSection from "./_components/SearchSection";
import { usePackages } from "./usePackages";
import DetailModal from "./_components/DetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function PackagesPage() {
  const {
    packages,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    closeDetailModal,
    openDetailModal,
    selectedPackage,
    showDetailModal,
    updatePackage,
    updateStatusPackage,
    createPackage,
    openCreateModal,
    showCreateModal,
    closeCreateModal,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    removeToast,
    toasts,
  } = usePackages();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Gói dịch vụ" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <PackageTable
                packages={packages}
                onPressPackage={openDetailModal}
                updateStatusPackage={updateStatusPackage}
              />
            </div>

            <Pagination
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>

      {/* Detail / Edit Modal */}
      {selectedPackage && (
        <DetailModal
          key={selectedPackage.packageId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          pkg={selectedPackage}
          onCreate={createPackage}
          onUpdate={updatePackage}
        />
      )}

      {/* Create Modal */}
      <DetailModal
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        pkg={null}
        onCreate={createPackage}
        onUpdate={updatePackage}
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
