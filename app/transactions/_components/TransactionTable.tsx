"use client";

import { useState } from "react";
import { TransactionType } from "@/utils/TransactionType";
import { AccountType } from "@/utils/AccountType";
import TransactionRow from "./TransactionRow";
import DetailModal from "./DetailModal";

type Props = {
  transactions: TransactionType[];
  accountMap?: Record<string, AccountType>;
};

const TransactionTable = ({ transactions, accountMap = {} }: Props) => {
  // STATE
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // HANDLERS
  const handleRowClick = (transaction: TransactionType) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không có giao dịch nào
      </div>
    );
  }

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-orange-100">
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Mã giao dịch
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Tài khoản
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Loại giao dịch
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Mô tả
            </th>

            <th className="text-right py-3 px-4 font-semibold text-orange-700">
              Số tiền
            </th>
            <th className="text-left py-3 px-4 font-semibold text-orange-700">
              Ngày giao dịch
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.transactionId}
              transaction={transaction}
              accountName={accountMap[transaction.accountId]?.email}
              onClick={() => handleRowClick(transaction)}
            />
          ))}
        </tbody>
      </table>

      <DetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionTable;
