// app/coaches/page.tsx
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
import { useCoaches } from "./useCoaches";
import CreateModal from "./_components/CreateModal";

export default function CoachesPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    totalPages,
    handlePageChange,
    currentPage,
    closeDetailModal,
    openDetailModal,
    selectedAccount,
    showDetailModal,
    updateStatusAccount,
    openCreateModal,
    showCreateModal,
    closeCreateModal,
    paginated,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    feedbacks,
    createAccount,
  } = useCoaches();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Tài khoản" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <Tabs activeKey="COACH" />

            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            <div className="overflow-x-auto">
              <AccountTable
                accounts={paginated}
                onPressAccount={openDetailModal}
                updateStatusAccount={updateStatusAccount}
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
      {selectedAccount && (
        <DetailModal
          key={selectedAccount.coachId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          coach={selectedAccount}
          feedbacks={feedbacks}
        />
      )}

      {/* Create Modal */}
      <CreateModal
        open={showCreateModal}
        onOpenChange={(open) => !open && closeCreateModal()}
        onSubmit={createAccount}
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
