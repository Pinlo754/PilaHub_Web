import { useEffect, useState } from "react";
import { OrderType } from "@/utils/OrderType";
import { OrderService } from "@/hooks/order.service";

const VENDOR_ID = "96c3c3ca-bafa-4deb-bf7d-cf1f1055b681";
const ORDER_PAGE_SIZE = 12;

export const useOrders = () => {
  // STATE
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await OrderService.getAll();
      setOrders(res);
    } catch (err: any) {
      if (err?.type === "BUSINESS_ERROR") {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayout = async (orderId: string) => {
    setIsLoading(true);
    try {
      await OrderService.payoutForVendor(orderId);

      if (isModalOpen) {
        handleCloseModal();
      }

      await fetchAll();
      setCurrentPage(0);
    } catch (err: any) {
      if (err?.type === "BUSINESS_ERROR") {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLERS
  const handleOpenModal = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // DERIVED — filter + paginate client-side
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE),
  );
  const pagedOrders = filteredOrders.slice(
    currentPage * ORDER_PAGE_SIZE,
    (currentPage + 1) * ORDER_PAGE_SIZE,
  );

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, []);

  // Reset về page 0 khi search thay đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  return {
    pagedOrders,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    errorMsg,
    searchTerm,
    setSearchTerm,
    selectedOrder,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handlePayout,
  };
};
