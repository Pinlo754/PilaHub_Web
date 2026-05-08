"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import Stats from "./_components/Stats";
import { useAiDocuments } from "./useAiDocument";
import AiDocumentTable from "./_components/AiDocumentTable";
import Pagination from "../accounts/_components/Pagination";
import DetailModal from "./_components/DetailModal";

export default function AiDocumentsPage() {
  const {
    documents,
    isLoading,
    totalPages,
    page,
    handleNextPage,
    handlePrevPage,
    selectedDocument,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    downloadFile,
    deleteFile,
    roadmapStatus,
    roadmapReviewStatus,
    scoringStatus,
    workoutStatus,
    checkingSection,
    activeSections,
    toggleSection,
    uploadingSection,
    uploadSectionFile,
    downloadSectionFile,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
  } = useAiDocuments();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Tài liệu AI" iconName="aiDocument" />

        <main className="flex-1 overflow-auto p-6">
          <Stats
            roadmapStatus={roadmapStatus}
            roadmapReviewStatus={roadmapReviewStatus}
            scoringStatus={scoringStatus}
            workoutStatus={workoutStatus}
            checkingSection={checkingSection}
            activeSections={activeSections}
            uploadingSection={uploadingSection}
            onToggle={toggleSection}
            onUpload={uploadSectionFile}
            onDownload={downloadSectionFile}
          />

          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <div className="overflow-x-auto">
              <AiDocumentTable
                documents={documents}
                onPressDocument={openDetailModal}
                onDelete={deleteFile}
                onDownload={downloadFile}
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

      {selectedDocument && (
        <DetailModal
          key={selectedDocument.name}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          document={selectedDocument}
          onDownload={downloadFile}
          onDelete={(fileName) => {
            closeDetailModal();
            deleteFile(fileName);
          }}
        />
      )}

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
