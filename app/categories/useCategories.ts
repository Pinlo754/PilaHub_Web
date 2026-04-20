import { useEffect, useState } from "react";
import {
  CategoryType,
  CreateCategoryReq,
  UpdateCategoryReq,
} from "@/utils/CategoryType";
import { CategoryService } from "@/hooks/category.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 10;

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // ---- API ----
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await CategoryService.getAll();
      setCategories(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (payload: CreateCategoryReq) => {
    setIsLoading(true);
    try {
      await CategoryService.createCategory(payload);
      await fetchAll();
      setShowCreateModal(false);
      showSuccess("Tạo danh mục thành công");
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (
    categoryId: string,
    payload: UpdateCategoryReq,
  ) => {
    setIsLoading(true);
    try {
      await CategoryService.updateCategory(categoryId, payload);
      await fetchAll();
      setShowDetailModal(false);
      setSelectedCategory(null);
      showSuccess("Cập nhật danh mục thành công");
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusCategory = (categoryId: string, active: boolean) => {
    confirm({
      title: active ? "Tắt danh mục?" : "Kích hoạt danh mục?",
      description: active
        ? "Danh mục này sẽ không còn hiển thị với người dùng."
        : "Danh mục này sẽ được kích hoạt trở lại.",
      confirmLabel: active ? "Tắt" : "Kích hoạt",
      variant: active ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (active) {
            await CategoryService.deactiveCategory(categoryId);
          } else {
            await CategoryService.activeCategory(categoryId);
          }
          await fetchAll();
          showSuccess(active ? "Đã tắt danh mục" : "Đã kích hoạt danh mục");
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const deleteCategory = (categoryId: string, name: string) => {
    confirm({
      title: "Xoá danh mục?",
      description: `Hành động này sẽ xoá vĩnh viễn danh mục "${name}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await CategoryService.deleteCategory(categoryId);
          await fetchAll();
          showSuccess("Đã xoá danh mục thành công");
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ---- MODAL ----
  const openDetailModal = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedCategory(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  // ---- PAGINATION ----
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    categories,
    filtered,
    paginated,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    selectedCategory,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createCategory,
    updateCategory,
    updateStatusCategory,
    deleteCategory,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
