import { AssessmentCriterionType } from "@/utils/AssessmentCriterionType";
import { PowerOff, Power } from "lucide-react";

type Props = {
  item: AssessmentCriterionType;
  index: number;
  onPress: (item: AssessmentCriterionType) => void;
  onToggleActive: (item: AssessmentCriterionType) => void;
};

const AssessmentCriterionRow = ({
  item,
  index,
  onPress,
  onToggleActive,
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

      <td className="py-3 px-4 text-gray-500 text-sm max-w-xs truncate">
        {item.description || <span className="text-gray-300 italic">—</span>}
      </td>

      <td className="py-3 px-4 text-center">
        <span className="font-mono text-sm text-gray-600 bg-orange-50 px-2 py-0.5 rounded">
          {item.displayOrder}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-500"
          }`}
        >
          {item.isActive ? "Đang hoạt động" : "Tạm dừng"}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(item);
            }}
            title={item.isActive ? "Tắt hoạt động" : "Kích hoạt"}
            className={`p-2 rounded-md inline-flex items-center justify-center transition ${
              item.isActive
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            {item.isActive ? <PowerOff size={16} /> : <Power size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AssessmentCriterionRow;