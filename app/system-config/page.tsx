"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import DetailModal from "./_components/DetailModal";
import { useSystemConfig } from "./useSystemConfig";
import SystemConfigTable from "./_components/SystemConfigTable";

export default function SystemConfigPage() {
  const {
    configs,
    isLoading,
    selectedConfig,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    updateConfig,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useSystemConfig();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Cấu hình hệ thống" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <div className="overflow-x-auto">
              <SystemConfigTable
                configs={configs}
                onPressConfig={openDetailModal}
              />
            </div>
          </div>
        </main>
      </div>

      {selectedConfig && (
        <DetailModal
          key={selectedConfig.configId}
          open={showDetailModal}
          onOpenChange={(open) => !open && closeDetailModal()}
          config={selectedConfig}
          onUpdate={updateConfig}
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
