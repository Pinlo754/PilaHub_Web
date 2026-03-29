import { useEffect, useState } from "react";
import { AccountType, UpdateAccountReq } from "@/utils/AccountType";
import { AccountService } from "@/hooks/account.service";

export const useAccounts = () => {
  // CONSTANT
  const SIZE = 11;

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

  const updateStatusAccount = async (accountId: string, active: boolean) => {
    setIsLoading(true);
    try {
      if (active) {
        await AccountService.deactiveAccount(accountId);
      } else {
        await AccountService.activeAccount(accountId);
      }

      await fetchAll();
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
    updateAccount,
    updateStatusAccount,
    openCreateModal,
    closeCreateModal,
    showCreateModal,
  };
};
