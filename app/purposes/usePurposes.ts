import { useEffect, useState, useRef } from "react";
import {
  PurposeType,
  CreatePurposeReq,
  UpdatePurposeReq,
} from "@/utils/PurposeType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { PurposeService } from "@/hooks/purpose.service";

export const usePurposes = () => {
  const PAGE_SIZE = 11;
  const DEBOUNCE_MS = 500;

  const [purposes, setPurposes] = useState<PurposeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<PurposeType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await PurposeService.getAll();
      setPurposes(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await PurposeService.searchByName(name);
      setPurposes(res);
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

  const createPurpose = async (payload: CreatePurposeReq) => {
    setIsLoading(true);
    try {
      await PurposeService.createPurpose(payload);
      showSuccess("Thêm mục đích thành công");
      setShowCreateModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurpose = async (payload: UpdatePurposeReq) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await PurposeService.updatePurpose(selected.purposeId, payload);
      showSuccess("Cập nhật thành công");
      setShowDetailModal(false);
      await refresh();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = (item: PurposeType) => {
    const isActive = item.active;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động mục đích "${item.name}"?`
        : `Bạn có chắc muốn kích hoạt mục đích "${item.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await PurposeService.deactivePurpose(item.purposeId);
            showSuccess("Đã tắt hoạt động");
          } else {
            await PurposeService.activePurpose(item.purposeId);
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

  const openDetailModal = (item: PurposeType) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(purposes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = purposes.slice(startIndex, startIndex + PAGE_SIZE);

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
    createPurpose,
    updatePurpose,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
