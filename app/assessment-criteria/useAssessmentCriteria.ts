import { useEffect, useState, useRef } from "react";
import { AssessmentCriterionService } from "@/hooks/assessmentCriterion.service";
import {
  AssessmentCriterionType,
  CreateAssessmentCriterionReq,
  UpdateAssessmentCriterionReq,
} from "@/utils/AssessmentCriterionType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useAssessmentCriteria = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  const [criteria, setCriteria] = useState<AssessmentCriterionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<AssessmentCriterionType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch ───────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await AssessmentCriterionService.getAll();
      setCriteria(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await AssessmentCriterionService.searchByName(name);
      setCriteria(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll();
  };

  // ─── Search ──────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  // ─── CRUD ────────────────────────────────────────────────────────────────

  const createCriterion = async (payload: CreateAssessmentCriterionReq) => {
    setIsLoading(true);
    try {
      await AssessmentCriterionService.createAssessmentCriterion(payload);
      showSuccess("Thêm tiêu chí đánh giá thành công");
      setShowCreateModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCriterion = async (payload: UpdateAssessmentCriterionReq) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await AssessmentCriterionService.updateAssessmentCriterion(
        selected.assessmentCriterionId,
        payload,
      );
      showSuccess("Cập nhật thành công");
      setShowDetailModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  // Deactive → gọi deactiveAssessmentCriterion
  // Active   → gọi updateAssessmentCriterion với isActive: true (giữ nguyên các trường khác)
  const toggleActive = (item: AssessmentCriterionType) => {
    const isActive = item.isActive;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động tiêu chí "${item.name}"?`
        : `Bạn có chắc muốn kích hoạt tiêu chí "${item.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await AssessmentCriterionService.deactiveAssessmentCriterion(
              item.assessmentCriterionId,
            );
            showSuccess("Đã tắt hoạt động");
          } else {
            await AssessmentCriterionService.updateAssessmentCriterion(
              item.assessmentCriterionId,
              {
                name: item.name,
                description: item.description,
                displayOrder: item.displayOrder,
                isActive: true,
              },
            );
            showSuccess("Đã kích hoạt");
          }
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────

  const openDetailModal = (item: AssessmentCriterionType) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  // ─── Pagination ──────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(criteria.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = criteria.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ─── Init ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchAll();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    isLoading,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    startIndex,
    selected,
    showDetailModal,
    showCreateModal,
    setShowCreateModal,
    openDetailModal,
    closeDetailModal,
    createCriterion,
    updateCriterion,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};