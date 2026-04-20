// app/trainees/page.tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import AccountTable from "./_components/AccountTable";
import Pagination from "./_components/Pagination";
import SearchSection from "./_components/SearchSection";
import DetailModal from "./_components/DetailModal";
import Tabs from "../accounts/_components/Tabs";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { useTrainees } from "./useTrainees";

export default function TraineesPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    closeDetailModal,
    openDetailModal,
    selectedTrainee,
    showDetailModal,
    deleteTrainee,
    paginated,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useTrainees();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Tài khoản" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <Tabs activeKey="TRAINEE" />

            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            <div className="overflow-x-auto">
              <AccountTable
                accounts={paginated}
                onPressAccount={openDetailModal}
                deleteTrainee={deleteTrainee}
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

      {/* Detail Modal */}
      {selectedTrainee && (
        <DetailModal
          key={selectedTrainee.traineeId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          trainee={selectedTrainee}
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
