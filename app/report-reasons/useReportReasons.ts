import { useEffect, useState, useRef } from "react";
import { ReportReasonService } from "@/hooks/reportReason.service";
import {
  ReportReasonType,
  CreateReportReasonReq,
  UpdateReportReasonReq,
} from "@/utils/ReportReasonType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useReportReasons = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  const [reportReasons, setReportReasons] = useState<ReportReasonType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ReportReasonType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await ReportReasonService.getAll();
      setReportReasons(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await ReportReasonService.searchByName(name);
      setReportReasons(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll();
  };

  const createReportReason = async (payload: CreateReportReasonReq) => {
    setIsLoading(true);
    try {
      await ReportReasonService.createReportReason(payload);
      showSuccess("Thêm lý do báo cáo thành công");
      setShowCreateModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportReason = async (payload: UpdateReportReasonReq) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await ReportReasonService.updateReportReason(
        selected.reportReasonId,
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

  const toggleActive = (item: ReportReasonType) => {
    const isActive = item.active;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động lý do "${item.name}"?`
        : `Bạn có chắc muốn kích hoạt lý do "${item.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await ReportReasonService.deactiveReportReason(item.reportReasonId);
            showSuccess("Đã tắt hoạt động");
          } else {
            await ReportReasonService.activeReportReason(item.reportReasonId);
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

  const deleteReportReason = (reportReasonId: string, name: string) => {
    confirm({
      title: "Xoá lý do báo cáo?",
      description: `Hành động này sẽ xoá vĩnh viễn "${name}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await ReportReasonService.deleteReportReason(reportReasonId);
          showSuccess("Đã xoá thành công");
          await refresh();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra khi xoá");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (item: ReportReasonType) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(reportReasons.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = reportReasons.slice(startIndex, startIndex + PAGE_SIZE);

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
    createReportReason,
    updateReportReason,
    toggleActive,
    deleteReportReason,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
