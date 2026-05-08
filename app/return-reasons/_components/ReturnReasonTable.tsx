import { ReturnReasonType } from "@/utils/ReturnReasonType";
import ReturnReasonRow from "./ReturnReasonRow";

type Props = {
  items: ReturnReasonType[];
  startIndex: number;
  onPress: (item: ReturnReasonType) => void;
  onDelete: (id: string, description: string) => void;
};

const ReturnReasonTable = ({ items, startIndex, onPress, onDelete }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã code
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
            <td colSpan={5} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <ReturnReasonRow
              key={item.reasonId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default ReturnReasonTable;
