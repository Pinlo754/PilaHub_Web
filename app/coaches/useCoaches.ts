import { useEffect, useState, useRef } from "react";
import { CoachService } from "@/hooks/coach.service";
import { CoachType, FeedbackCoachType } from "@/utils/CoachType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { CreateAccountReq } from "@/utils/AccountType";
import { AccountService } from "@/hooks/account.service";

export const useCoaches = () => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_MS = 500;

  const [coaches, setCoaches] = useState<CoachType[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackCoachType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<CoachType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await CoachService.getAll();
      setCoaches(res);
    } catch (err: any) {
      showError(err?.message ?? "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByName = async (name: string) => {
    setIsLoading(true);
    try {
      const res = await CoachService.searchByName(name);
      setCoaches(res);
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === "") fetchAll();
      else fetchByName(value.trim());
    }, DEBOUNCE_MS);
  };

  const updateStatusAccount = (coachId: string, active: boolean) => {
    confirm({
      title: active ? "Khoá tài khoản?" : "Kích hoạt tài khoản?",
      description: active
        ? "HLV sẽ không thể đăng nhập sau khi bị khoá."
        : "HLV sẽ có thể đăng nhập và hoạt động trở lại.",
      confirmLabel: active ? "Khoá" : "Kích hoạt",
      variant: active ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (active) {
            await CoachService.deactiveCoach(coachId);
            showSuccess("Đã khoá tài khoản thành công");
          } else {
            await CoachService.activeCoach(coachId);
            showSuccess("Đã kích hoạt tài khoản thành công");
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

  const updatePricePerHour = async (coachId: string, price: number) => {
    confirm({
      title: "Cập nhật giá/giờ?",
      description: `Xác nhận cập nhật giá thành ${price.toLocaleString("vi-VN")}đ/giờ?`,
      confirmLabel: "Cập nhật",
      variant: "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await CoachService.updatePricePerHour(coachId, price);
          showSuccess("Cập nhật giá/giờ thành công");
          await refresh();
          // Cập nhật lại selectedAccount để modal hiển thị giá mới
          setSelectedAccount((prev) =>
            prev ? { ...prev, pricePerHour: price } : prev,
          );
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

  const fetchFeedbacks = async (coachId: string) => {
    setIsLoading(true);
    try {
      const res = await CoachService.getFeedbacksByCoachId(coachId);
      setFeedbacks(res);
    } catch {
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (payload: CreateAccountReq) => {
    setIsLoading(true);
    try {
      await AccountService.createAccount(payload);
      await refresh();
      setShowCreateModal(false);
      showSuccess("Tạo tài khoản HLV thành công");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailModal = async (account: CoachType) => {
    setSelectedAccount(account);
    await fetchFeedbacks(account.coachId);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedAccount(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const totalPages = Math.max(1, Math.ceil(coaches.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginated = coaches.slice(startIndex, startIndex + PAGE_SIZE);

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
    coaches,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    startIndex,
    selectedAccount,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    setShowDetailModal,
    updateStatusAccount,
    updatePricePerHour,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    feedbacks,
    createAccount,
  };
};
