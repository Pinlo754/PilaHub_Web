import { EquipmentType } from "@/utils/EquipmentType";
import { formatLocalDateTime } from "@/utils/day";
import { Trash2 } from "lucide-react";

type Props = {
  equipment: EquipmentType;
  onPressEquipment: (equipment: EquipmentType) => void;
  onDelete: (equipmentId: string, name: string) => void;
};

const EquipmentRow = ({ equipment, onDelete, onPressEquipment }: Props) => {
  const shortId = `${equipment.equipmentId.slice(0, 6)}...`;

  return (
    <tr
      onClick={() => onPressEquipment(equipment)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4">
        <img
          src={equipment.imageUrl || "/default-logo.png"}
          alt={equipment.name}
          className="w-10 h-10 object-cover rounded-lg border mx-auto"
        />
      </td>
      <td className="py-3 px-4 text-gray-700 font-medium">{equipment.name}</td>
      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
        {equipment.description || <span className="text-gray-300">—</span>}
      </td>
      <td className="py-3 px-4 text-center text-gray-500">
        {formatLocalDateTime(equipment.createdAt, "datetime")}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(equipment.equipmentId, equipment.name);
          }}
          className="p-2 rounded-md transition inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default EquipmentRow;
