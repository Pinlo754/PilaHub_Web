import { IngredientWithRulesType } from "@/utils/IngredientType";
import IngredientRow from "./IngredientRow";

type Props = {
  ingredients: IngredientWithRulesType[];
  onPressIngredient: (ingredient: IngredientWithRulesType) => void;
  onToggleActive: (
    ingredientId: string,
    currentActive: boolean,
    name: string,
  ) => void;
};

const IngredientTable = ({
  ingredients,
  onPressIngredient,
  onToggleActive,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên nguyên liệu
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Số quy tắc
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Loại quy tắc
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
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
        {ingredients.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-10 text-center text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          ingredients.map((ing) => (
            <IngredientRow
              key={ing.ingredientId}
              ingredient={ing}
              onPressIngredient={onPressIngredient}
              onToggleActive={onToggleActive}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default IngredientTable;
