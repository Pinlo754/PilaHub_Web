import { PurposeType } from "@/utils/PurposeType";
import PurposeRow from "./PurposeRow";

type Props = {
  items: PurposeType[];
  startIndex: number;
  onPress: (item: PurposeType) => void;
  onToggleActive: (item: PurposeType) => void;
};

const PurposeTable = ({
  items,
  startIndex,
  onPress,
  onToggleActive,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên mục đích
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã code
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
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
            <PurposeRow
              key={item.purposeId}
              item={item}
              index={startIndex + idx + 1}
              onPress={onPress}
              onToggleActive={onToggleActive}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default PurposeTable;
