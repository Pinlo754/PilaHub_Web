import { useCallback, useEffect, useRef, useState } from "react";
import {
  FitnessGoalType,
  CreateFitnessGoalReq,
  UpdateFitnessGoalReq,
  PurposeType,
} from "@/utils/FitnessGoalType";
import { FitnessGoalService } from "@/hooks/fitnessGoal.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useToast } from "@/hooks/useToast";

const SIZE = 13;
const DEBOUNCE_MS = 500;

export const useFitnessGoals = () => {
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoalType[]>([]);
  const [purposes, setPurposes] = useState<PurposeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false); // phân biệt pagination vs search

  const [selectedGoal, setSelectedGoal] = useState<FitnessGoalType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- API ----
  const fetchAll = useCallback(
    async (targetPage = page) => {
      setIsLoading(true);
      try {
        const res = await FitnessGoalService.getAll({
          page: targetPage,
          size: SIZE,
        });
        setFitnessGoals(res.content);
        setTotalPages(res.totalPages);
        setIsSearchMode(false);
      } catch (err: any) {
        showError(err?.message ?? "Có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    },
    [page],
  );

  const fetchPurposes = useCallback(async () => {
    try {
      const res = await FitnessGoalService.getAllPurpose();
      setPurposes(res);
    } catch {
      // purposes load thất bại không block UI
    }
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        if (!value.trim()) {
          setPage(0);
          await fetchAll(0);
          return;
        }
        setIsLoading(true);
        try {
          const res = await FitnessGoalService.searchByName(value.trim());
          setFitnessGoals(res);
          setTotalPages(1); // search trả về flat array, không phân trang
          setIsSearchMode(true);
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_MS);
    },
    [fetchAll],
  );

  const createFitnessGoal = async (payload: CreateFitnessGoalReq) => {
    setIsLoading(true);
    try {
      await FitnessGoalService.createFitnessGoal(payload);
      setSearchTerm("");
      setPage(0);
      await fetchAll(0);
      setShowCreateModal(false);
      showSuccess("Tạo mục tiêu tập luyện thành công");
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFitnessGoal = async (
    goalId: string,
    payload: UpdateFitnessGoalReq,
  ) => {
    setIsLoading(true);
    try {
      await FitnessGoalService.updateFitnessGoal(goalId, payload);
      await fetchAll(page);
      setShowDetailModal(false);
      setSelectedGoal(null);
      showSuccess("Cập nhật mục tiêu tập luyện thành công");
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusFitnessGoal = (goalId: string, isActive: boolean) => {
    confirm({
      title: isActive ? "Tắt mục tiêu tập luyện?" : "Kích hoạt mục tiêu tập luyện?",
      description: isActive
        ? "Mục tiêu này sẽ bị vô hiệu hoá."
        : "Mục tiêu này sẽ được kích hoạt trở lại.",
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await FitnessGoalService.deactiveFitnessGoal(goalId);
            showSuccess("Đã tắt mục tiêu tập luyện");
          } else {
            await FitnessGoalService.activeFitnessGoal(goalId);
            showSuccess("Đã kích hoạt mục tiêu tập luyện");
          }
          await fetchAll(page);
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ---- HANDLERS ----
  const handleNextPage = () => {
    if (isSearchMode) return; // không phân trang khi đang search
    const next = page + 1;
    setPage(next);
    fetchAll(next);
  };

  const handlePrevPage = () => {
    if (isSearchMode || page === 0) return;
    const prev = page - 1;
    setPage(prev);
    fetchAll(prev);
  };

  const openDetailModal = (goal: FitnessGoalType) => {
    setSelectedGoal(goal);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedGoal(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  useEffect(() => {
    fetchAll(0);
    fetchPurposes();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    fitnessGoals,
    purposes,
    isLoading,
    searchTerm,
    setSearchTerm: handleSearchChange,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    isSearchMode,
    selectedGoal,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createFitnessGoal,
    updateFitnessGoal,
    updateStatusFitnessGoal,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
  };
};
