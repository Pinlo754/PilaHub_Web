// app/coaches/useCoaches.ts
import { useEffect, useState } from "react";
import { CoachService } from "@/hooks/coach.service";
import { CoachType, FeedbackCoachType } from "@/utils/CoachType";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { CreateAccountReq } from "@/utils/AccountType";
import { AccountService } from "@/hooks/account.service";

export const useCoaches = () => {
  const PAGE_SIZE = 10;

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

  // API
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

  const updateStatusAccount = (accountId: string, active: boolean) => {
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
            await CoachService.deactiveCoach(accountId);
            showSuccess("Đã khoá tài khoản thành công");
          } else {
            await CoachService.activeCoach(accountId);
            showSuccess("Đã kích hoạt tài khoản thành công");
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
      await fetchAll();
      setShowCreateModal(false);
      showSuccess("Tạo tài khoản HLV thành công");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // MODAL HANDLERS
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

  // PAGINATION
  const filtered = coaches.filter((c) =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    coaches,
    isLoading,
    fetchAll,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    selectedAccount,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    setShowDetailModal,
    updateStatusAccount,
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
