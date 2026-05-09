import { useEffect, useState, useRef } from "react";
import { OrderService } from "@/hooks/order.service";
import { OrderType, ORDER_STATUS, SHIPMENT_STATUS } from "@/utils/OrderType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 10;

export const useGHNSimulator = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<OrderType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await OrderService.getAll();
      // Filter: SHIPPED + có shipments
      const filtered = res.filter(
        (o) =>
          o.status === ORDER_STATUS.SHIPPED &&
          o.shipments &&
          o.shipments.length > 0,
      );
      setOrders(filtered);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsDelivered = (order: OrderType) => {
    confirm({
      title: "Xác nhận giao hàng thành công?",
      description: `Đơn hàng #${order.orderNumber} sẽ được chuyển sang trạng thái "Đã giao".`,
      confirmLabel: "Xác nhận",
      variant: "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await OrderService.updateShipmentStatus(
            order.shipments[0].shipmentId,
            SHIPMENT_STATUS.DELIVERED
          );
          showSuccess(`Đơn hàng #${order.orderNumber} đã được giao thành công`);
          setShowDetailModal(false);
          await fetchAll();
        } catch (err: any) {
          showError(err?.message ?? "Có lỗi xảy ra");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (order: OrderType) => {
    setSelected(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelected(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = orders.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    isLoading,
    orders,
    paginated,
    startIndex,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    selected,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    markAsDelivered,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
  };
};
