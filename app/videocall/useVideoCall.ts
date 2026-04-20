import { useEffect, useState } from "react";
import { CoachBookingType, BOOKING_STATUS } from "@/utils/CoachBookingType";
import { CoachBookingService } from "@/hooks/coachBooking.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useVideoCall = () => {
  const SIZE = 10;

  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  const [bookings, setBookings] = useState<CoachBookingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<CoachBookingType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await CoachBookingService.getAll();
      // Chỉ lấy các booking có status SCHEDULED
      setBookings(res.filter((b) => b.status === BOOKING_STATUS.SCHEDULED));
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const markReady = (bookingId: string) => {
    confirm({
      title: "Xác nhận chuyển đổi trạng thái?",
      description: "Buổi tập này sẽ được chuyển sang trạng thái Sẵn Sàng.",
      confirmLabel: "Xác nhận",
      variant: "info",
      onConfirm: async () => {
        closeDetailModal();
        setIsLoading(true);
        try {
          await CoachBookingService.updateStatus(
            bookingId,
            BOOKING_STATUS.READY,
          );
          await fetchAll();
          showSuccess("Đã cập nhật trạng thái thành thành công");
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const openDetailModal = (booking: CoachBookingType) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedBooking(null);
    setShowDetailModal(false);
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = bookings.slice((safePage - 1) * SIZE, safePage * SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    bookings,
    isLoading,
    selectedBooking,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    markReady,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    toasts,
    removeToast,
    currentPage: safePage,
    totalPages,
    paginated,
    handlePageChange,
  };
};
