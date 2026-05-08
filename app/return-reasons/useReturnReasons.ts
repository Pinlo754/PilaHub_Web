import { useEffect, useState, useRef } from "react";
import { ReturnReasonService } from "@/hooks/returnReason.service";
import {
  ReturnReasonType,
  CreateReturnReasonReq,
  UpdateReturnReasonReq,
} from "@/utils/ReturnReasonType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useReturnReasons = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  const [returnReasons, setReturnReasons] = useState<ReturnReasonType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ReturnReasonType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await ReturnReasonService.getAll();
      setReturnReasons(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByKeyword = async (keyword: string) => {
    setIsLoading(true);
    try {
      const res = await ReturnReasonService.searchByKeyword(keyword);
      setReturnReasons(res);
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
      else fetchByKeyword(value.trim());
    }, DEBOUNCE_MS);
  };

  const refresh = async () => {
    if (searchTerm.trim()) await fetchByKeyword(searchTerm.trim());
    else await fetchAll();
  };

  const createReturnReason = async (payload: CreateReturnReasonReq) => {
    setIsLoading(true);
    try {
      await ReturnReasonService.createReturnReason(payload);
      showSuccess("Thêm lý do hoàn trả thành công");
      setShowCreateModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updateReturnReason = async (payload: UpdateReturnReasonReq) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await ReturnReasonService.updateReturnReason(selected.reasonId, payload);
      showSuccess("Cập nhật thành công");
      setShowDetailModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReturnReason = (reasonId: string, description: string) => {
    confirm({
      title: "Xoá lý do hoàn trả?",
      description: `Hành động này sẽ xoá vĩnh viễn "${description}" và không thể hoàn tác.`,
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await ReturnReasonService.deleteReturnReason(reasonId);
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

  const openDetailModal = (item: ReturnReasonType) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(returnReasons.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = returnReasons.slice(startIndex, startIndex + PAGE_SIZE);

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
    createReturnReason,
    updateReturnReason,
    deleteReturnReason,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
