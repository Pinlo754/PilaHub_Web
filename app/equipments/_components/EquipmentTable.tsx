import { EquipmentType } from "@/utils/EquipmentType";
import EquipmentRow from "./EquipmentRow";

type Props = {
  equipments: EquipmentType[];
  onPressEquipment: (equipment: EquipmentType) => void;
  onDelete: (equipmentId: string, name: string) => void;
  startIndex: number;
};

const EquipmentTable = ({
  equipments,
  onDelete,
  onPressEquipment,
  startIndex,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            STT
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ảnh
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên thiết bị
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày tạo
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {equipments.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
              Không có thiết bị nào
            </td>
          </tr>
        ) : (
          equipments.map((eq, index) => (
            <EquipmentRow
              key={eq.equipmentId}
              equipment={eq}
              onPressEquipment={onPressEquipment}
              onDelete={onDelete}
              index={startIndex + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default EquipmentTable;
