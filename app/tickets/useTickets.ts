import { useEffect, useState } from "react";
import { TicketRes, TicketStatusType } from "@/utils/TicketType";
import { VendorType } from "@/utils/VendorType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { VendorService } from "@/hooks/vendor.service";
import { TicketService } from "@/hooks/ticket.service";

export const useTickets = () => {
  const PAGE_SIZE = 10;

  const [tickets, setTickets] = useState<TicketRes[]>([]);
  const [vendorMap, setVendorMap] = useState<Record<string, VendorType>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatusType | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<TicketRes | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const fetchVendors = async (accountIds: string[]) => {
    const uniqueIds = [...new Set(accountIds)];
    const newIds = uniqueIds.filter((id) => !vendorMap[id]);
    if (newIds.length === 0) return;

    const results = await Promise.allSettled(
      newIds.map((id) => VendorService.getById(id)),
    );

    const newMap: Record<string, VendorType> = {};
    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        newMap[newIds[idx]] = result.value;
      }
    });

    setVendorMap((prev) => ({ ...prev, ...newMap }));
  };

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await TicketService.getAll();
      // Sort by createdAt descending (newest first)
      const sorted = [...res].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setTickets(sorted);
      await fetchVendors(sorted.map((t) => t.accountId));
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilterChange = (value: TicketStatusType | "") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const approveTicket = (ticketId: string) => {
    confirm({
      title: "Duyệt đơn?",
      description: "Bạn có chắc muốn duyệt đơn này?",
      confirmLabel: "Duyệt",
      variant: "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await TicketService.approveTicket(ticketId);
          showSuccess("Đã duyệt đơn");
          await fetchAll();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const rejectTicket = (ticketId: string) => {
    confirm({
      title: "Từ chối đơn?",
      description: "Bạn có chắc muốn từ chối đơn này?",
      confirmLabel: "Từ chối",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await TicketService.rejectTicket(ticketId);
          showSuccess("Đã từ chối đơn");
          await fetchAll();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (item: TicketRes) => {
    setSelected(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const filtered = statusFilter
    ? tickets.filter((t) => t.status === statusFilter)
    : tickets;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    isLoading,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    vendorMap,
    startIndex,
    selected,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    approveTicket,
    rejectTicket,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
