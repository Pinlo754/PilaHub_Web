import { TransactionService } from "@/hooks/transaction.service";
import { AccountService } from "@/hooks/account.service";
import { TransactionType, TransactionTypeEnum } from "@/utils/TransactionType";
import { AccountType } from "@/utils/AccountType";
import {
  getTransactionFlow,
  getTransactionCategory,
  TransactionCategoryType,
} from "@/utils/uiMapper";
import { useEffect, useState } from "react";

const PAGE_SIZE = 12;

export const useTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [accountMap, setAccountMap] = useState<Record<string, AccountType>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategoryType>("ALL");
  const [selectedType, setSelectedType] = useState<TransactionTypeEnum | "ALL">(
    "ALL",
  );

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const data = await TransactionService.getAll();
      setTransactions(data);

      const uniqueAccountIds = [...new Set(data.map((t) => t.accountId))];
      const newAccountMap: Record<string, AccountType> = {};

      for (const accountId of uniqueAccountIds) {
        try {
          const account = await AccountService.getById(accountId);
          newAccountMap[accountId] = account;
        } catch (err) {
          console.error(`Failed to fetch account ${accountId}:`, err);
        }
      }

      setAccountMap(newAccountMap);
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

  // FILTER by search term (thêm referenceId)
  const filteredBySearch = transactions.filter((t) =>
    [t.transactionId, t.transactionType, t.description, t.referenceId]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // FILTER by category
  const filteredByCategory =
    selectedCategory === "ALL"
      ? filteredBySearch
      : filteredBySearch.filter(
          (t) => getTransactionCategory(t.transactionType) === selectedCategory,
        );

  // FILTER by type
  const filtered =
    selectedType === "ALL"
      ? filteredByCategory
      : filteredByCategory.filter((t) => t.transactionType === selectedType);

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

  const handleCategoryChange = (category: TransactionCategoryType) => {
    setSelectedCategory(category);
    setSelectedType("ALL"); // reset type khi đổi category
    setCurrentPage(1);
  };

  const handleTypeChange = (type: TransactionTypeEnum | "ALL") => {
    setSelectedType(type);
    setCurrentPage(1);
  };

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
    accountMap,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    selectedType,
    setSelectedType: handleTypeChange,
    allTransactions: transactions,
  };
};
