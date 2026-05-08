import { SupplementType } from "@/utils/SupplementType";
import { PowerOff, Power, Trash2, ExternalLink } from "lucide-react";

type Props = {
  item: SupplementType;
  index: number;
  onPress: (item: SupplementType) => void;
  onToggleActive: (item: SupplementType) => void;
  onDelete: (id: string, name: string) => void;
};

const SupplementRow = ({
  item,
  index,
  onPress,
  onToggleActive,
  onDelete,
}: Props) => {
  return (
    <tr
      onClick={() => onPress(item)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>

      <td className="py-3 px-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover border border-orange-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-300 text-xs">
            N/A
          </div>
        )}
      </td>

      <td className="py-3 px-4 text-gray-700 font-medium max-w-xs">
        <p className="truncate">{item.name}</p>
        <p className="text-xs text-gray-400 truncate">{item.description}</p>
      </td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {item.brand || <span className="italic text-gray-300">—</span>}
      </td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {item.form || <span className="italic text-gray-300">—</span>}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.supplementId, item.name);
            }}
            title="Xoá"
            className="p-2 rounded-md inline-flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SupplementRow;
