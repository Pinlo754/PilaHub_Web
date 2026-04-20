import { CategoryType } from "@/utils/CategoryType";
import { getCategoryTypeConfig } from "@/utils/uiMapper";
import { Power, PowerOff, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

type Props = {
  category: CategoryType;
  parentName: string | null;
  onPressCategory: (category: CategoryType) => void;
  updateStatusCategory: (categoryId: string, active: boolean) => void;
  deleteCategory: (categoryId: string, name: string) => void;
};

const CategoryRow = ({
  category,
  parentName,
  onPressCategory,
  updateStatusCategory,
  deleteCategory,
}: Props) => {
  const typeCfg = category.categoryType
    ? getCategoryTypeConfig(category.categoryType)
    : null;

  const shortId = `${category.categoryId.slice(0, 6)}…`;

  return (
    <tr
      onClick={() => onPressCategory(category)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer transition"
    >
      {/* Mã */}
      <td className="py-3 px-4">
        <span className=" text-gray-500 ">{shortId}</span>
      </td>

      {/* Tên */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-9 h-9 rounded-lg object-cover border border-orange-100 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <span className="text-orange-400 text-xs font-bold">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-gray-800 font-medium">{category.name}</span>
        </div>
      </td>

      {/* Danh mục cha */}
      <td className="py-3 px-4 text-gray-600 text-sm">
        {parentName ? (
          <span className=" text-gray-700 font-medium">{parentName}</span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Loại */}
      <td className="py-3 px-4 text-center">
        {typeCfg ? (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${typeCfg.bgColor} ${typeCfg.textColor}`}
          >
            {typeCfg.label}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Trạng thái */}
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${category.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
        >
          {category.active ? "Hoạt động" : "Tạm dừng"}
        </span>
      </td>

      {/* Hành động */}
      <td className="py-3 px-4 text-center">
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() =>
              updateStatusCategory(category.categoryId, category.active)
            }
            className={`p-2 rounded-md transition inline-flex items-center justify-center ${
              category.active
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={category.active ? "Tạm dừng" : "Kích hoạt"}
          >
            {category.active ? <Power size={16} /> : <PowerOff size={16} />}
          </button>
          <button
            onClick={() => deleteCategory(category.categoryId, category.name)}
            className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition inline-flex items-center justify-center"
            title="Xoá"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;
