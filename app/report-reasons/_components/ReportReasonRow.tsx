import { ReportReasonType } from "@/utils/ReportReasonType";
import { Trash2, PowerOff, Power } from "lucide-react";

type Props = {
  item: ReportReasonType;
  index: number;
  onPress: (item: ReportReasonType) => void;
  onToggleActive: (item: ReportReasonType) => void;
  onDelete: (id: string, name: string) => void;
};

const ReportReasonRow = ({
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

      <td className="py-3 px-4 text-gray-700 font-medium">{item.name}</td>

      <td className="py-3 px-4">
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.code}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.requiresDescription
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.requiresDescription ? "Có" : "Không"}
        </span>
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
          {/* Toggle Active */}
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

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.reportReasonId, item.name);
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

export default ReportReasonRow;
