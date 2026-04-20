import { useEffect, useState } from "react";
import {
  FitnessGoalType,
  CreateFitnessGoalReq,
  UpdateFitnessGoalReq,
} from "@/utils/FitnessGoalType";
import { FitnessGoalService } from "@/hooks/fitnessGoal.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useToast } from "@/hooks/useToast";

export const useFitnessGoals = () => {
  // CONSTANT
  const SIZE = 13;

  // STATE
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoalType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoalType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // HOOKS
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await FitnessGoalService.getAll({ page, size: SIZE });
      setFitnessGoals(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const createFitnessGoal = async (payload: CreateFitnessGoalReq) => {
    setIsLoading(true);
    try {
      await FitnessGoalService.createFitnessGoal(payload);
      await fetchAll();
      setShowCreateModal(false);
      showSuccess("Tạo mục tiêu thể lực thành công");
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
      await fetchAll();
      setShowDetailModal(false);
      setSelectedGoal(null);
      showSuccess("Cập nhật mục tiêu thể lực thành công");
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusFitnessGoal = async (goalId: string, isActive: boolean) => {
    confirm({
      title: isActive ? "Tắt mục tiêu thể lực?" : "Kích hoạt mục tiêu thể lực?",
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
            showSuccess("Đã tắt mục tiêu thể lực");
          } else {
            await FitnessGoalService.activeFitnessGoal(goalId);
            showSuccess("Đã kích hoạt mục tiêu thể lực");
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

  // HANDLERS
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

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

  // EFFECT
  useEffect(() => {
    fetchAll();
  }, [page]);

  return {
    fitnessGoals,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
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
