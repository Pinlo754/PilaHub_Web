// app/ingredients/page.tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import IngredientTable from "./_components/IngredientTable";
import Pagination from "./_components/Pagination";
import SearchSection from "./_components/SearchSection";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useIngredients } from "./useIngredients";
import DetailModal from "./_components/DetailModal";

export default function IngredientsPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    closeDetailModal,
    openDetailModal,
    openCreateModal,
    selectedIngredient,
    showDetailModal,
    isCreateMode,
    toggleActive,
    paginated,
    createIngredient,
    updateIngredient,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useIngredients();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Nguyên liệu" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <IngredientTable
                ingredients={paginated}
                onPressIngredient={openDetailModal}
                onToggleActive={toggleActive}
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

      {/* Detail / Create Modal */}
      {showDetailModal && (
        <DetailModal
          key={selectedIngredient?.ingredientId ?? "create"}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          ingredient={isCreateMode ? null : selectedIngredient}
          onCreate={createIngredient}
          onUpdate={updateIngredient}
        />
      )}

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
