import { useEffect, useState } from "react";
import { TraineeService } from "@/hooks/trainee.service";
import { TraineeType } from "@/utils/TraineeType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useTrainees = () => {
  const PAGE_SIZE = 10;

  const [trainees, setTrainees] = useState<TraineeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await TraineeService.getAll();
      setTrainees(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrainee = (traineeId: string, fullName: string) => {
    confirm({
      title: "Xoá học viên?",
      description: `Hành động này sẽ xoá vĩnh viễn tài khoản của "${fullName}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await TraineeService.deleteTrainee(traineeId);
          showSuccess("Đã xoá học viên thành công");
          await fetchAll();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // MODAL HANDLERS
  const openDetailModal = (trainee: TraineeType) => {
    setSelectedTrainee(trainee);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedTrainee(null);
    setShowDetailModal(false);
  };

  // PAGINATION
  const filtered = trainees.filter((t) =>
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
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
    trainees,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    selectedTrainee,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    deleteTrainee,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
