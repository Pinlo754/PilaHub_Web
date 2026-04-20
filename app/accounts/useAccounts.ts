import { useEffect, useState } from "react";
import {
  AccountType,
  CreateAccountReq,
  UpdateAccountReq,
} from "@/utils/AccountType";
import { AccountService } from "@/hooks/account.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useToast } from "@/hooks/useToast";

export const useAccounts = () => {
  // CONSTANT
  const SIZE = 10;

  // STATE
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const { confirmState, isConfirmOpen, confirm, closeConfirm } = useConfirm();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await AccountService.getAll({
        page,
        size: SIZE,
      });
      setAccounts(res.content);
      setTotalPages(res.totalPages);
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

  const updateAccount = async (payload: UpdateAccountReq) => {
    if (!selectedAccount) return;

    setIsLoading(true);
    try {
      await AccountService.updateAccount(selectedAccount.accountId, payload);

      await fetchAll();

      setShowDetailModal(false);
      setSelectedAccount(null);
      showSuccess("Cập nhật tài khoản thành công");
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusAccount = async (accountId: string, active: boolean) => {
    confirm({
      title: active ? "Tạm dừng tài khoản?" : "Kích hoạt tài khoản?",
      description: active
        ? "Tài khoản sẽ bị tạm dừng và không thể đăng nhập."
        : "Tài khoản sẽ được kích hoạt trở lại.",
      confirmLabel: active ? "Tạm dừng" : "Kích hoạt",
      variant: active ? "danger" : "info",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          if (active) {
            await AccountService.deactiveAccount(accountId);
            showSuccess("Đã tạm dừng tài khoản");
          } else {
            await AccountService.activeAccount(accountId);
            showSuccess("Đã kích hoạt tài khoản");
          }

          await fetchAll();
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

  // HANDLERS
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const openDetailModal = (account: AccountType) => {
    setSelectedAccount(account);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedAccount(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, [page]);

  return {
    accounts,
    isLoading,
    errorMsg,
    fetchAll,
    searchTerm,
    setSearchTerm,
    handleNextPage,
    handlePrevPage,
    totalPages,
    page,
    selectedAccount,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    setShowDetailModal,
    createAccount,
    updateAccount,
    updateStatusAccount,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
    // confirm
    confirmState,
    isConfirmOpen,
    closeConfirm,
    // toast
    toasts,
    removeToast,
  };
};
