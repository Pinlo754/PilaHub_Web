import { BodyPartType } from "@/utils/BodyPartType";
import { formatLocalDateTime } from "@/utils/day";
import { getBodyPartLabel } from "@/utils/uiMapper";
import { Trash2 } from "lucide-react";

type Props = {
  bodyPart: BodyPartType;
  index: number;
  onPress: (bodyPart: BodyPartType) => void;
  onDelete: (bodyPartId: string, name: string) => void;
};

const BodyPartRow = ({ bodyPart, index, onPress, onDelete }: Props) => {
  return (
    <tr
      onClick={() => onPress(bodyPart)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>
      <td className="py-3 px-4 text-gray-700 font-medium">
        {getBodyPartLabel(bodyPart.name)}
      </td>
      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
        {bodyPart.description ?? (
          <span className="italic text-gray-400">Chưa có mô tả</span>
        )}
      </td>
      <td className="py-3 px-4 text-center text-gray-700">
        {formatLocalDateTime(bodyPart.createdAt, "datetime")}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bodyPart.bodyPartId, bodyPart.name);
          }}
          className="p-2 rounded-md inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default BodyPartRow;
