"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useTransactions } from "./useTransactions";
import SearchSection from "./_components/SearchSection";
import Pagination from "./_components/Pagination";
import CategoryStats from "./_components/CategoryStats";
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
    accountMap,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    allTransactions,
  } = useTransactions();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Giao dịch" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            <CategoryStats
              transactions={allTransactions}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedCategory={selectedCategory}
            />

            <TransactionTable
              transactions={paginated}
              accountMap={accountMap}
            />

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
