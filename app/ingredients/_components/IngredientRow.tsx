import { IngredientWithRulesType } from "@/utils/IngredientType";
import { formatLocalDateTime } from "@/utils/day";
import { getRuleTypeConfig } from "@/utils/uiMapper";
import { Power, PowerOff, ToggleLeft, ToggleRight } from "lucide-react";

type Props = {
  ingredient: IngredientWithRulesType;
  onPressIngredient: (ingredient: IngredientWithRulesType) => void;
  onToggleActive: (
    ingredientId: string,
    currentActive: boolean,
    name: string,
  ) => void;
};

const MAX_TAGS = 3;

const IngredientRow = ({
  ingredient,
  onPressIngredient,
  onToggleActive,
}: Props) => {
  const shortId = `${ingredient.ingredientId.slice(0, 6)}...`;
  const ruleCount = ingredient.ingredientRules.length;

  // Unique rule types, capped at MAX_TAGS
  const uniqueTypes = [
    ...new Set(ingredient.ingredientRules.map((r) => r.ruleType)),
  ];
  const visibleTypes = uniqueTypes.slice(0, MAX_TAGS);
  const extraCount = uniqueTypes.length - MAX_TAGS;

  return (
    <tr
      onClick={() => onPressIngredient(ingredient)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      {/* Short ID */}
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      {/* Name */}
      <td className="py-3 px-4 text-gray-800 font-medium">{ingredient.name}</td>

      {/* Rule count */}
      <td className="py-3 px-4 text-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
          {ruleCount}
        </span>
      </td>

      {/* Rule types */}
      <td className="py-3 px-4 text-center">
        <div className="flex flex-wrap gap-1 justify-center">
          {ruleCount === 0 ? (
            <span className="text-gray-400 text-xs">—</span>
          ) : (
            <>
              {visibleTypes.map((type) => {
                const cfg = getRuleTypeConfig(type);
                return (
                  <span
                    key={type}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bgColor} ${cfg.textColor}`}
                  >
                    {cfg.label}
                  </span>
                );
              })}
              {extraCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{extraCount}
                </span>
              )}
            </>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            ingredient.active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {ingredient.active ? "Hoạt động" : "Tạm dừng"}
        </span>
      </td>

      {/* CreatedAt */}
      <td className="py-3 px-4 text-center text-gray-600 text-sm">
        {formatLocalDateTime(ingredient.createdAt, "datetime")}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(
              ingredient.ingredientId,
              ingredient.active,
              ingredient.name,
            );
          }}
          className={`p-2 rounded-md transition inline-flex items-center justify-center ${
            ingredient.active
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
          title={ingredient.active ? "Tạm dừng" : "Kích hoạt"}
        >
          {ingredient.active ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
      </td>
    </tr>
  );
};

export default IngredientRow;
