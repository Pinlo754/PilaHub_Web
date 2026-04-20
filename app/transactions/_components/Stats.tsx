import { formatShortVND, formatVND } from "@/utils/number";

type Props = {
  total: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
};

const Stats = ({ total, totalIncome, totalExpense, netAmount }: Props) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="text-sm text-gray-600">Tổng giao dịch</div>
        <div className="text-2xl font-bold text-blue-600 mt-2">{total}</div>
      </div>
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="text-sm text-gray-600">Tổng thu</div>
        <div
          className="text-2xl font-bold text-green-600 mt-2"
          title={formatVND(totalIncome)}
        >
          +{formatShortVND(totalIncome)}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="text-sm text-gray-600">Tổng chi</div>
        <div
          className="text-2xl font-bold text-red-600 mt-2"
          title={formatVND(totalExpense)}
        >
          -{formatShortVND(totalExpense)}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="text-sm text-gray-600">Số dư ròng</div>
        <div
          className={`text-2xl font-bold mt-2 ${netAmount >= 0 ? "text-blue-600" : "text-red-600"}`}
          title={formatVND(Math.abs(netAmount))}
        >
          {netAmount >= 0 ? "+" : "-"}
          {formatShortVND(Math.abs(netAmount))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
