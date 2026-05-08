import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import {
  getRuleActionConfig,
  getRuleOperatorLabel,
  getRuleSeverityConfig,
  getRuleTypeConfig,
} from "@/utils/uiMapper";

export type IngredientEntry = {
  ingredientId: string;
  amount: string;
  unit: string;
  notes: string;
};
export type IngredientEntryError = Partial<
  Record<keyof IngredientEntry, string>
>;

type Props = {
  entry: IngredientEntry;
  index: number;
  ingredients: IngredientType[];
  rulesMap: Record<string, IngredientRuleType[]>;
  usedIds: string[];
  errors: IngredientEntryError;
  onChange: (field: keyof IngredientEntry, value: string) => void;
  onDelete: () => void;
  onLoadRules: (id: string) => void;
};

export const IngredientRow = ({
  entry,
  index,
  ingredients,
  rulesMap,
  usedIds,
  errors,
  onChange,
  onDelete,
  onLoadRules,
}: Props) => {
  const [showRules, setShowRules] = useState(false);
  const available = ingredients.filter(
    (i) =>
      !usedIds.includes(i.ingredientId) ||
      i.ingredientId === entry.ingredientId,
  );
  const rules = entry.ingredientId
    ? (rulesMap[entry.ingredientId] ?? null)
    : null;

  const handleIngredientChange = (id: string) => {
    onChange("ingredientId", id);
    if (id && !rulesMap[id]) onLoadRules(id);
  };

  return (
    <div className="border border-orange-100 rounded-xl p-4 space-y-3 bg-orange-50/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-orange-700">
          Nguyên liệu #{index + 1}
        </span>
        <button
          onClick={onDelete}
          className="p-1 text-red-400 hover:text-red-600 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field className="col-span-2">
          <Label>Nguyên liệu</Label>
          <select
            value={entry.ingredientId}
            onChange={(e) => handleIngredientChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          >
            <option value="">— Chọn nguyên liệu —</option>
            {available.map((i) => (
              <option key={i.ingredientId} value={i.ingredientId}>
                {i.name}
              </option>
            ))}
          </select>
          {errors.ingredientId && (
            <p className="text-xs text-red-500">{errors.ingredientId}</p>
          )}
        </Field>

        <Field>
          <Label>Số lượng</Label>
          <Input
            type="number"
            min={0}
            value={entry.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            placeholder="VD: 500"
          />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount}</p>
          )}
        </Field>

        <Field>
          <Label>Đơn vị</Label>
          <Input
            value={entry.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            placeholder="VD: mg, g, IU"
          />
          {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
        </Field>

        <Field className="col-span-2">
          <Label>Ghi chú</Label>
          <Input
            value={entry.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Ghi chú (tuỳ chọn)"
          />
        </Field>
      </div>

      {entry.ingredientId && (
        <button
          type="button"
          onClick={() => setShowRules((p) => !p)}
          className="flex items-center gap-1 text-xs text-orange-600 hover:underline"
        >
          {showRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {rules === null ? "Tải quy tắc" : `Quy tắc (${rules.length})`}
        </button>
      )}

      {showRules && rules && rules.length > 0 && (
        <div className="space-y-2">
          {rules.map((rule) => {
            const typeConf = getRuleTypeConfig(rule.ruleType);
            const sevConf = getRuleSeverityConfig(rule.severity);
            const actConf = getRuleActionConfig(rule.action);
            return (
              <div
                key={rule.ingredientRuleId}
                className="text-xs bg-white border border-gray-100 rounded-lg p-2 space-y-1"
              >
                <div className="flex flex-wrap gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-medium ${typeConf.bgColor} ${typeConf.textColor}`}
                  >
                    {typeConf.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-medium ${sevConf.bgColor} ${sevConf.textColor}`}
                  >
                    {sevConf.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-medium ${actConf.bgColor} ${actConf.textColor}`}
                  >
                    {actConf.label}
                  </span>
                </div>
                <p className="text-gray-500">{rule.ruleDescription}</p>
                <p className="font-mono text-gray-400">
                  {getRuleOperatorLabel(rule.operator)} {rule.value}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {showRules && rules?.length === 0 && (
        <p className="text-xs text-gray-400 italic">Không có quy tắc</p>
      )}
    </div>
  );
};
