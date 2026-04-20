"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import Pagination from "./_components/Pagination";
import SearchSection from "./_components/SearchSection";
import LiveSessionReportTable from "./_components/LiveSessionReportTable";
import ResolveReportModal from "./_components/ResolveReportModal";
import DetailModal from "./_components/DetailModal";
import { useReports } from "./useReports";

export default function ReportsPage() {
  const {
    paginated,
    traineeMap,
    coachMap,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    selectedReport,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    resolveTarget,
    showResolveModal,
    openResolveModal,
    closeResolveModal,
    resolveReport,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
    resolverMap,
  } = useReports();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Báo cáo buổi học" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            <div className="overflow-x-auto">
              <LiveSessionReportTable
                reports={paginated}
                traineeMap={traineeMap}
                coachMap={coachMap}
                onPressReport={openDetailModal}
                onResolve={openResolveModal}
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
      {selectedReport && (
        <DetailModal
          key={selectedReport.liveSessionId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          report={selectedReport}
          trainee={traineeMap[selectedReport.reporterId] ?? null}
          coach={coachMap[selectedReport.reportedUserId] ?? null}
          resolverMap={resolverMap}
          onResolve={openResolveModal}
        />
      )}

      {/* Resolve Modal */}
      <ResolveReportModal
        open={showResolveModal}
        onOpenChange={(open) => !open && closeResolveModal()}
        report={resolveTarget}
        onSubmit={resolveReport}
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
