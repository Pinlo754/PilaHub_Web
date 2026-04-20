import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { TransactionType } from "@/utils/TransactionType";
import {
  getTransactionFlowConfig,
  getTransactionTypeConfig,
} from "@/utils/uiMapper";

type Props = {
  transaction: TransactionType;
  accountName?: string;
  onClick?: () => void;
};

const TransactionRow = ({ transaction, accountName, onClick }: Props) => {
  const flowConfig = getTransactionFlowConfig(transaction.transactionType);
  const typeConfig = getTransactionTypeConfig(transaction.transactionType);
  const shortId = `${transaction.transactionId.slice(0, 6)}...`;

  return (
    <tr
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
      onClick={onClick}
    >
      <td className="py-3 px-4 text-gray-500 ">{shortId}</td>
      <td className="py-3 px-4 text-gray-700 max-w-[180px] truncate">
        {accountName || "—"}
      </td>
      <td className="py-3 px-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
        >
          {typeConfig.label}
        </span>
      </td>
      <td
        className="py-3 px-4 text-gray-700 max-w-[200px] truncate"
        title={transaction.description}
      >
        {transaction.description || "—"}
      </td>

      <td
        className={`py-3 px-4 text-right font-semibold ${flowConfig.textColor}`}
      >
        {flowConfig.sign}
        {formatVND(transaction.amount)}
      </td>
      <td className="py-3 px-4 text-gray-600 text-sm">
        {formatLocalDateTime(transaction.transactionDate)}
      </td>
    </tr>
  );
};

export default TransactionRow;
