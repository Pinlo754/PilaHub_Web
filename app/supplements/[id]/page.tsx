"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { ChevronLeft } from "lucide-react";
import { useSupplementDetail } from "./useSupplementDetail";
import InfoSection from "./_components/InfoSection";
import IngredientSection from "./_components/IngredientSection";
import PurposeSection from "./_components/PurposeSection";
import { Header } from "@/components/header";

type Props = { params: Promise<{ id: string }> };

export default function SupplementDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const submitRef = useRef<(() => void) | null>(null);

  const {
    supplement,
    suppIngredients,
    suppPurposes,
    allIngredients,
    allPurposes,
    rulesMap,
    loadRules,
    usedIngredientIds,
    usedPurposeIds,
    isLoading,
    updateSupplement,
    toggleActive,
    deleteSupplement,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    createPurpose,
    updatePurpose,
    deletePurpose,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  } = useSupplementDetail(id);

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Thực phẩm chức năng" />

        <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-10 bg-orange-50">
          <button
            onClick={() => router.push("/supplements")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </button>

          {supplement && (
            <button
              onClick={() => submitRef.current?.()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-200 border border-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Lưu thay đổi</span>
            </button>
          )}
        </div>

        <main className="flex-1 overflow-auto px-6 pb-6">
          {supplement ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Col 1 */}

              <InfoSection
                supplement={supplement}
                onUpdate={updateSupplement}
                onToggleActive={toggleActive}
                onDelete={deleteSupplement}
                isLoading={isLoading}
                submitRef={submitRef}
              />

              {/* Col 2 */}
              <div className="col-span-1 flex flex-col gap-4">
                <IngredientSection
                  suppIngredients={suppIngredients}
                  allIngredients={allIngredients}
                  usedIngredientIds={usedIngredientIds}
                  rulesMap={rulesMap}
                  onLoadRules={loadRules}
                  onCreate={createIngredient}
                  onUpdate={updateIngredient}
                  onDelete={deleteIngredient}
                />

                <PurposeSection
                  suppPurposes={suppPurposes}
                  allPurposes={allPurposes}
                  usedPurposeIds={usedPurposeIds}
                  onCreate={createPurpose}
                  onUpdate={updatePurpose}
                  onDelete={deletePurpose}
                />
              </div>
            </div>
          ) : !isLoading ? (
            <div className="text-center py-20 text-gray-400">
              Không tìm thấy sản phẩm
            </div>
          ) : null}
        </main>
      </div>

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
