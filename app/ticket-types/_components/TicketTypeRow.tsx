import { TicketType } from "@/utils/TicketType";
import { PowerOff, Power } from "lucide-react";
import { formatLocalDateTime } from "@/utils/day";

type Props = {
  item: TicketType;
  index: number;
  onPress: (item: TicketType) => void;
  onToggleActive: (item: TicketType) => void;
};

const TicketTypeRow = ({ item, index, onPress, onToggleActive }: Props) => {
  return (
    <tr
      onClick={() => onPress(item)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>

      <td className="py-3 px-4 text-gray-700 font-medium">{item.name}</td>

      <td className="py-3 px-4 text-gray-500 text-sm max-w-xs truncate">
        {item.description || <span className="italic text-gray-300">—</span>}
      </td>

      <td className="py-3 px-4 text-center text-sm text-gray-500">
        {formatLocalDateTime(item.createdAt)}
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-500"
          }`}
        >
          {item.active ? "Đang hoạt động" : "Tạm dừng"}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(item);
            }}
            title={item.active ? "Tắt hoạt động" : "Kích hoạt"}
            className={`p-2 rounded-md inline-flex items-center justify-center transition ${
              item.active
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            {item.active ? <PowerOff size={16} /> : <Power size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TicketTypeRow;
