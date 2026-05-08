"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useSupplements } from "./useSupplements";
import SearchSection from "./_components/SearchSection";
import SupplementTable from "./_components/SupplementTable";
import Pagination from "./_components/Pagination";
import CreateModal from "./_components/CreateModal";

export default function SupplementsPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    paginated,
    startIndex,
    showCreateModal,
    setShowCreateModal,
    handlePress,
    toggleActive,
    deleteSupplement,
    refresh,
    toasts,
    removeToast,
    showSuccess,
    showError,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    allIngredients,
    allPurposes,
    isModalDataLoading,
    loadIngredientRules,
    openCreateModal,
    rulesMap,
    submitCreateSupplement,
  } = useSupplements();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Thực phẩm chức năng" iconName="supplements" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onOpenCreate={() => setShowCreateModal(true)}
            />
            <div className="overflow-x-auto">
              <SupplementTable
                items={paginated}
                startIndex={startIndex}
                onPress={handlePress}
                onToggleActive={toggleActive}
                onDelete={deleteSupplement}
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

      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        allIngredients={allIngredients}
        allPurposes={allPurposes}
        rulesMap={rulesMap}
        isModalDataLoading={isModalDataLoading}
        onLoadRules={loadIngredientRules}
        onSubmit={submitCreateSupplement}
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
