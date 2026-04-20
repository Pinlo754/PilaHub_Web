"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { CategoryType as CategoryEntity } from "@/utils/CategoryType";
import { getCategoryTypeConfig } from "@/utils/uiMapper";
import { Button } from "@/components/ui/button";

import { CreateCategoryReq, UpdateCategoryReq } from "@/utils/CategoryType";
import SubcategoryModal from "./SubcategoryModal";

const PAGE_SIZE = 4;

type Props = {
  parentCategoryId: string;
  subcategories: CategoryEntity[];
  allCategories: CategoryEntity[];
  isLoading: boolean;
  onCreate: (payload: CreateCategoryReq) => Promise<void>;
  onUpdate: (categoryId: string, payload: UpdateCategoryReq) => Promise<void>;
};

const SubcategoryList = ({
  parentCategoryId,
  subcategories,
  allCategories,
  isLoading,
  onCreate,
  onUpdate,
}: Props) => {
  const [page, setPage] = useState(1);
  const [selectedSub, setSelectedSub] = useState<CategoryEntity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const totalPages = Math.max(1, Math.ceil(subcategories.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = subcategories.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const openCreate = () => {
    setSelectedSub(null);
    setIsCreateMode(true);
    setShowModal(true);
  };

  const openEdit = (sub: CategoryEntity) => {
    setSelectedSub(sub);
    setIsCreateMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSub(null);
  };

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Danh mục con
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            {subcategories.length}
          </span>
        </h3>
        <Button
          type="button"
          variant="outline"
          onClick={openCreate}
          className="flex items-center gap-1 text-orange-700 border-orange-300 hover:bg-orange-50 text-xs px-3 py-1 h-auto"
        >
          <Plus size={13} /> Thêm mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 size={20} className="animate-spin text-orange-400" />
        </div>
      ) : subcategories.length === 0 ? (
        <div className="flex items-center justify-center h-20 border-2 border-dashed border-orange-100 rounded-xl text-gray-400 text-xs">
          Chưa có danh mục con nào
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border border-orange-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-50 border-b border-orange-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-orange-700">
                    Tên
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-orange-700">
                    Loại
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-orange-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((sub) => {
                  const typeCfg = sub.categoryType
                    ? getCategoryTypeConfig(sub.categoryType)
                    : null;
                  return (
                    <tr
                      key={sub.categoryId}
                      onClick={() => openEdit(sub)}
                      className="border-b border-orange-50 hover:bg-orange-50/60 cursor-pointer transition last:border-0"
                    >
                      <td className="py-2 px-3 text-gray-700 font-medium">
                        {sub.name}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {typeCfg ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.bgColor} ${typeCfg.textColor}`}
                          >
                            {typeCfg.label}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${sub.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {sub.active ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1 rounded-md hover:bg-orange-100 disabled:opacity-40 transition"
              >
                <ChevronLeft size={15} className="text-orange-700" />
              </button>
              <span className="text-xs text-gray-500">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1 rounded-md hover:bg-orange-100 disabled:opacity-40 transition"
              >
                <ChevronRight size={15} className="text-orange-700" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Sub modal */}
      <SubcategoryModal
        open={showModal}
        onOpenChange={(open) => !open && closeModal()}
        subcategory={isCreateMode ? null : selectedSub}
        parentCategoryId={parentCategoryId}
        allCategories={allCategories}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={closeModal}
      />
    </div>
  );
};

export default SubcategoryList;
