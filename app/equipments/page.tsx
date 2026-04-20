"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useEquipments } from "./useEquipments";
import SearchSection from "./_components/SearchSection";
import EquipmentTable from "./_components/EquipmentTable";
import Pagination from "./_components/Pagination";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import DetailModal from "./_components/DetailModal";

export default function EquipmentsPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    paginated,
    handleCreate,
    handleDelete,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    selectedEquipment,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
    handleUpdate,
  } = useEquipments();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Thiết bị tập" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <EquipmentTable
                equipments={paginated}
                onDelete={handleDelete}
                onPressEquipment={openDetailModal}
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

      {selectedEquipment && (
        <DetailModal
          key={selectedEquipment.equipmentId}
          mode="detail"
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          equipment={selectedEquipment}
          onUpdate={handleUpdate}
        />
      )}

      <DetailModal
        mode="create"
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        onSubmit={handleCreate}
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
