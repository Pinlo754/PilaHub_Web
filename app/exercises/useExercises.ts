import { useEffect, useState } from "react";
import { ExerciseService } from "@/hooks/exercise.service";
import { ExerciseType } from "@/utils/ExerciseType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 10;

export const useExercises = () => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await ExerciseService.getAll();
      setExercises(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailModal = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedExercise(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateSuccess = async () => {
    closeCreateModal();
    await fetchAll();
    showSuccess("Tạo bài tập thành công!");
  };

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    exercises,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    selectedExercise,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
    handleCreateSuccess,
    toasts,
    removeToast,
    showSuccess,
    showError,
    confirmState,
    isConfirmOpen,
    confirm,
    closeConfirm,
  };
};
