import { ReportReasonType } from "@/utils/ReportReasonType";
import ReportReasonRow from "./ReportReasonRow";

type Props = {
  items: ReportReasonType[];
  startIndex: number;
  onPress: (item: ReportReasonType) => void;
  onToggleActive: (item: ReportReasonType) => void;
  onDelete: (id: string, name: string) => void;
};

const ReportReasonTable = ({
  items,
  startIndex,
  onPress,
  onToggleActive,
  onDelete,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên lý do
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã code
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Bắt buộc mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <ReportReasonRow
              key={item.reportReasonId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default ReportReasonTable;
