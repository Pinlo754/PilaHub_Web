"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import DetailModal from "./_components/DetailModal";
import { useCategories } from "./useCategories";
import SearchSection from "./_components/SearchSection";
import CategoryTable from "./_components/CategoryTable";
import Pagination from "./_components/Pagination";

export default function CategoriesPage() {
  const {
    categories,
    paginated,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    selectedCategory,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createCategory,
    updateCategory,
    updateStatusCategory,
    deleteCategory,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useCategories();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Danh mục" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />
            <div className="overflow-x-auto">
              <CategoryTable
                categories={paginated}
                onPressCategory={openDetailModal}
                updateStatusCategory={updateStatusCategory}
                deleteCategory={deleteCategory}
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

      {selectedCategory && (
        <DetailModal
          key={selectedCategory.categoryId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          category={selectedCategory}
          allCategories={categories}
          onCreate={createCategory}
          onUpdate={updateCategory}
        />
      )}

      <DetailModal
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        category={null}
        allCategories={categories}
        onCreate={createCategory}
        onUpdate={updateCategory}
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
