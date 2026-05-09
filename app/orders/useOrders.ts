import { useCallback, useEffect, useRef, useState } from "react";
import { OrderStatusType, OrderType } from "@/utils/OrderType";
import { OrderService } from "@/hooks/order.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const ORDER_PAGE_SIZE = 12;
const DEBOUNCE_MS = 500;

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusType | "ALL">(
    "ALL",
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  // ---- API ----
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await OrderService.getAll();
      setOrders(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePayout = useCallback(
    (orderId: string, orderNumber: string) => {
      confirm({
        title: "Xác nhận trả tiền nhà cung cấp?",
        description: `Bạn sắp thực hiện thanh toán cho đơn hàng #${orderNumber}. Hành động này không thể hoàn tác.`,
        confirmLabel: "Xác nhận trả tiền",
        variant: "info",
        onConfirm: async () => {
          setIsLoading(true);
          try {
            await OrderService.payoutForVendor(orderId);
            handleCloseModal();
            await fetchAll();
            setCurrentPage(0);
            showSuccess("Đã trả tiền nhà cung cấp thành công");
          } catch (err: any) {
            showError(err?.message ?? "Có lỗi xảy ra khi trả tiền");
          } finally {
            setIsLoading(false);
          }
        },
      });
    },
    [fetchAll],
  );

  // ---- HANDLERS ----
  const handleOpenModal = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setIsLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsLoading(false);
      setCurrentPage(0);
    }, DEBOUNCE_MS);
  }, []);

  const handleStatusFilterChange = (status: OrderStatusType | "ALL") => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  // ---- DERIVED ----
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE),
  );
  const safePage = Math.min(currentPage, totalPages - 1);
  const pagedOrders = filteredOrders.slice(
    safePage * ORDER_PAGE_SIZE,
    (safePage + 1) * ORDER_PAGE_SIZE,
  );

  useEffect(() => {
    fetchAll();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    pagedOrders,
    currentPage: safePage,
    totalPages,
    setCurrentPage,
    isLoading,
    searchTerm,
    setSearchTerm: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    selectedOrder,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handlePayout,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
