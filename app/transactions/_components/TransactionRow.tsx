import { formatLocalDateTime } from "@/utils/day";
import { formatVND } from "@/utils/number";
import { TransactionType } from "@/utils/TransactionType";
import {
  getTransactionFlowConfig,
  getTransactionTypeConfig,
} from "@/utils/uiMapper";

type Props = {
  transaction: TransactionType;
};

const TransactionRow = ({ transaction }: Props) => {
  const flowConfig = getTransactionFlowConfig(transaction.transactionType);
  const typeConfig = getTransactionTypeConfig(transaction.transactionType);

  return (
    <tr className="border-b border-orange-100 hover:bg-orange-50">
      <td className="py-3 px-4 text-gray-500 text-sm font-mono">
        {transaction.transactionId}
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
      <td className="py-3 px-4 text-gray-500 text-sm font-mono">
        {transaction.referenceId || "—"}
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
