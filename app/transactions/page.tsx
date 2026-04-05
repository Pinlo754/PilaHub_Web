"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useTransactions } from "./useTransactions";
import SearchSection from "./_components/SearchSection";
import Pagination from "./_components/Pagination";
import Stats from "./_components/Stats";
import TransactionTable from "./_components/TransactionTable";

export default function TransactionsPage() {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    paginated,
    stats,
  } = useTransactions();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Giao dịch" />
        <main className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <Stats
            total={stats.total}
            totalIncome={stats.totalIncome}
            totalExpense={stats.totalExpense}
            netAmount={stats.netAmount}
          />

          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Search */}
            <SearchSection searchTerm={searchTerm} onChange={setSearchTerm} />

            {/* Table */}
            <TransactionTable transactions={paginated} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
