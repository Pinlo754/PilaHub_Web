import { TransactionService } from "@/hooks/transaction.service";
import { TransactionType } from "@/utils/TransactionType";
import { getTransactionFlow } from "@/utils/uiMapper";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export const useTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const data = await TransactionService.getAll();
      setTransactions(data);
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

  // FILTER
  const filtered = transactions.filter((t) =>
    [t.transactionId, t.transactionType, t.description, t.referenceId]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // STATS
  const totalIncome = filtered
    .filter((t) => getTransactionFlow(t.transactionType) === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => getTransactionFlow(t.transactionType) === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = {
    total: filtered.length,
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
  };

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // USE EFFECT
  useEffect(() => {
    fetchAll();
  }, []);

  return {
    isLoading,
    errorMsg,
    fetchAll,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: safePage,
    totalPages,
    handlePageChange,
    paginated,
    stats,
  };
};
