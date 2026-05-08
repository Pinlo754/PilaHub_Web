import { useCallback, useEffect, useRef, useState } from "react";
import { IngredientService } from "@/hooks/ingredient.service";
import {
  IngredientWithRulesType,
  CreateIngredientReq,
  UpdateIngredientReq,
  CreateIngredientRuleReq,
  IngredientType,
} from "@/utils/IngredientType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useIngredients = () => {
  const PAGE_SIZE = 11;
  const DEBOUNCE_MS = 500;

  const [ingredients, setIngredients] = useState<IngredientWithRulesType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientWithRulesType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- API ----
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const list = await IngredientService.getAll();
      setIngredients(await fetchWithRules(list));
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithRules = async (
    list: IngredientType[],
  ): Promise<IngredientWithRulesType[]> =>
    Promise.all(
      list.map(async (ing) => {
        const rules = await IngredientService.getRuleById(ing.ingredientId);
        return { ...ing, ingredientRules: rules };
      }),
    );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          if (value.trim()) {
            const list = await IngredientService.searchByName(value.trim());
            setIngredients(await fetchWithRules(list));
          } else {
            await fetchAll();
          }
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_MS);
    },
    [fetchAll],
  );

  const createIngredient = async (payload: CreateIngredientReq) => {
    setIsLoading(true);
    try {
      await IngredientService.createIngredient(payload);
      showSuccess("Tạo nguyên liệu thành công");
      closeDetailModal();
      await fetchAll();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tạo nguyên liệu");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update ingredient:
   * 1. PATCH /ingredients/:id  — cập nhật name + các rule CŨ
   * 2. POST /ingredients/:id/rule/add  — gọi riêng cho từng rule MỚI
   */
  const updateIngredient = async (
    ingredientId: string,
    payload: UpdateIngredientReq,
    newRules: CreateIngredientRuleReq[],
  ) => {
    setIsLoading(true);
    try {
      await IngredientService.updateIngredient(ingredientId, payload);

      if (newRules.length > 0) {
        await Promise.all(
          newRules.map((rule) =>
            IngredientService.createIngredientRule(ingredientId, rule),
          ),
        );
      }

      showSuccess("Cập nhật nguyên liệu thành công");
      closeDetailModal();
      await fetchAll();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = (
    ingredientId: string,
    currentActive: boolean,
    name: string,
  ) => {
    confirm({
      title: currentActive ? "Tạm dừng nguyên liệu?" : "Kích hoạt nguyên liệu?",
      description: currentActive
        ? `Nguyên liệu "${name}" sẽ bị tạm dừng sử dụng.`
        : `Nguyên liệu "${name}" sẽ được kích hoạt trở lại.`,
      confirmLabel: currentActive ? "Tạm dừng" : "Kích hoạt",
      variant: currentActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (currentActive) {
            await IngredientService.deactiveIngredient(ingredientId);
            showSuccess("Đã tạm dừng nguyên liệu");
          } else {
            await IngredientService.activeIngredient(ingredientId);
            showSuccess("Đã kích hoạt nguyên liệu");
          }
          await fetchAll();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ---- MODAL HANDLERS ----
  const openDetailModal = (ing: IngredientWithRulesType) => {
    setSelectedIngredient(ing);
    setIsCreateMode(false);
    setShowDetailModal(true);
  };

  const openCreateModal = () => {
    setSelectedIngredient(null);
    setIsCreateMode(true);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedIngredient(null);
    setIsCreateMode(false);
    setShowDetailModal(false);
  };

  // ---- PAGINATION ----
  const totalPages = Math.max(1, Math.ceil(ingredients.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = ingredients.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startIndex = (safePage - 1) * PAGE_SIZE;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    ingredients,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    selectedIngredient,
    showDetailModal,
    isCreateMode,
    openDetailModal,
    openCreateModal,
    closeDetailModal,
    createIngredient,
    updateIngredient,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    startIndex,
  };
};
