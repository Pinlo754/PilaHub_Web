import { CategoryType } from "@/utils/CategoryType";
import CategoryRow from "./CategoryRow";

const PAGE_SIZE = 10;

type Props = {
  categories: CategoryType[];
  onPressCategory: (category: CategoryType) => void;
  updateStatusCategory: (categoryId: string, active: boolean) => void;
  deleteCategory: (categoryId: string, name: string) => void;
};

const CategoryTable = ({
  categories,
  onPressCategory,
  updateStatusCategory,
  deleteCategory,
}: Props) => {
  // Build a lookup map: id → name for resolving parent names
  const nameMap = Object.fromEntries(
    categories.map((c) => [c.categoryId, c.name]),
  );

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700 w-32">
            Mã
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên danh mục
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Danh mục cha
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Loại
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
        {categories.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-10 text-center text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          categories.map((cat) => (
            <CategoryRow
              key={cat.categoryId}
              category={cat}
              parentName={
                cat.parentCategoryId
                  ? (nameMap[cat.parentCategoryId] ??
                    `${cat.parentCategoryId.slice(0, 8)}…`)
                  : null
              }
              onPressCategory={onPressCategory}
              updateStatusCategory={updateStatusCategory}
              deleteCategory={deleteCategory}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoryTable;
