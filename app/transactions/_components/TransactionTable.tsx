import { TransactionType } from "@/utils/TransactionType";
import TransactionRow from "./TransactionRow";

type Props = {
  transactions: TransactionType[];
};

const TransactionTable = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không có giao dịch nào
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã giao dịch
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Loại giao dịch
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã tham chiếu
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
          />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
