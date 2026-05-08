import { SupplementType } from "@/utils/SupplementType";
import SupplementRow from "./SupplementRow";

type Props = {
  items: SupplementType[];
  startIndex: number;
  onPress: (item: SupplementType) => void;
  onToggleActive: (item: SupplementType) => void;
  onDelete: (id: string, name: string) => void;
};

const SupplementTable = ({
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
          <th className="text-left py-3 px-4 font-semibold text-orange-700 w-16">
            Ảnh
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên sản phẩm
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Thương hiệu
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Dạng
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
            <td colSpan={7} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <SupplementRow
              key={item.supplementId}
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

export default SupplementTable;
