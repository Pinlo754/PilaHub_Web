import { useEffect, useState, useRef } from "react";
import {
  TicketType,
  CreateTicketTypeReq,
  UpdateTicketTypeReq,
} from "@/utils/TicketType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { TicketTypeService } from "@/hooks/ticketType.service";

export const useTicketTypes = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<TicketType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await TicketTypeService.getAll();
      setTicketTypes(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = ticketTypes.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const createTicketType = async (payload: CreateTicketTypeReq) => {
    setIsLoading(true);
    try {
      await TicketTypeService.createTicketType(payload);
      showSuccess("Thêm loại đơn thành công");
      setShowCreateModal(false);
      await fetchAll();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi thêm");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketType = async (payload: UpdateTicketTypeReq) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await TicketTypeService.updateTicketType(selected.ticketTypeId, payload);
      showSuccess("Cập nhật thành công");
      setShowDetailModal(false);
      await fetchAll();
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = (item: TicketType) => {
    const isActive = item.active;
    confirm({
      title: isActive ? "Tắt hoạt động?" : "Kích hoạt?",
      description: isActive
        ? `Bạn có chắc muốn tắt hoạt động loại đơn "${item.name}"?`
        : `Bạn có chắc muốn kích hoạt loại đơn "${item.name}"?`,
      confirmLabel: isActive ? "Tắt" : "Kích hoạt",
      variant: isActive ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (isActive) {
            await TicketTypeService.deactiveTicketType(item.ticketTypeId);
            showSuccess("Đã tắt hoạt động");
          } else {
            await TicketTypeService.activeTicketType(item.ticketTypeId);
            showSuccess("Đã kích hoạt");
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

  const openDetailModal = (item: TicketType) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

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
    createTicketType,
    updateTicketType,
    toggleActive,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
