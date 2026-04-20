"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import AccountTable from "./_components/AccountTable";
import Pagination from "./_components/Pagination";
import SearchSection from "./_components/SearchSection";
import { useAccounts } from "./useAccounts";
import DetailModal from "./_components/DetailModal";
import Tabs from "./_components/Tabs";
import CreateModal from "./_components/CreateModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";

export default function AccountsPage() {
  // HOOK
  const {
    accounts,
    isLoading,
    errorMsg,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    closeDetailModal,
    openDetailModal,
    selectedAccount,
    showDetailModal,
    updateAccount,
    updateStatusAccount,
    openCreateModal,
    showCreateModal,
    closeCreateModal,
    createAccount,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
  } = useAccounts();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Tài khoản" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Tabs */}
            <Tabs activeKey="ACCOUNT" />

            {/* Search & Filter */}
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              openCreateModal={openCreateModal}
            />

            {/* Table */}
            <div className="overflow-x-auto">
              <AccountTable
                accounts={accounts}
                onPressAccount={openDetailModal}
                updateStatusAccount={updateStatusAccount}
              />
            </div>

            {/* Pagination */}
            <Pagination
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedAccount && (
        <DetailModal
          key={selectedAccount.accountId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          account={selectedAccount}
          onSubmit={updateAccount}
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
