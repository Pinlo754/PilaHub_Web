import { ReturnReasonType } from "@/utils/ReturnReasonType";
import { Trash2 } from "lucide-react";

type Props = {
  item: ReturnReasonType;
  index: number;
  onPress: (item: ReturnReasonType) => void;
  onDelete: (id: string, description: string) => void;
};

const ReturnReasonRow = ({ item, index, onPress, onDelete }: Props) => {
  return (
    <tr
      onClick={() => onPress(item)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>

      <td className="py-3 px-4 text-gray-700 font-medium">
        {item.description}
      </td>

      <td className="py-3 px-4">
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.code}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-500"
          }`}
        >
          {item.enabled ? "Đang hoạt động" : "Tạm dừng"}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.reasonId, item.description);
            }}
            title="Xoá"
            className="p-2 rounded-md inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReturnReasonRow;
