import { Plus } from "lucide-react";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import {
  IngredientRow,
  IngredientEntry,
  IngredientEntryError,
} from "./IngredientRow";

type Props = {
  entries: IngredientEntry[];
  errors: IngredientEntryError[];
  ingredients: IngredientType[];
  rulesMap: Record<string, IngredientRuleType[]>;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onChange: (idx: number, field: keyof IngredientEntry, value: string) => void;
  onLoadRules: (id: string) => void;
};

export const IngredientsStep = ({
  entries,
  errors,
  ingredients,
  rulesMap,
  onAdd,
  onRemove,
  onChange,
  onLoadRules,
}: Props) => {
  const usedIds = entries.map((e) => e.ingredientId).filter(Boolean);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Thêm các nguyên liệu có trong sản phẩm
        </p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          <Plus size={16} /> Thêm nguyên liệu
        </button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-orange-100 rounded-xl">
          Chưa có nguyên liệu nào. Nhấn &quot;Thêm nguyên liệu&quot; để bắt đầu.
        </div>
      )}

      {entries.map((entry, idx) => (
        <IngredientRow
          key={idx}
          entry={entry}
          index={idx}
          ingredients={ingredients}
          rulesMap={rulesMap}
          usedIds={usedIds}
          errors={errors[idx] ?? {}}
          onChange={(field, value) => onChange(idx, field, value)}
          onDelete={() => onRemove(idx)}
          onLoadRules={onLoadRules}
        />
      ))}
    </div>
  );
};
