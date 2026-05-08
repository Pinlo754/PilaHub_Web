"use client";

import { useState } from "react";
import {
  SupplementIngredientType,
  UpdateSupplementIngredientReq,
} from "@/utils/SupplementIngredientType";
import { IngredientType, IngredientRuleType } from "@/utils/IngredientType";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Check,
} from "lucide-react";
import {
  getRuleActionConfig,
  getRuleOperatorLabel,
  getRuleSeverityConfig,
  getRuleTypeConfig,
} from "@/utils/uiMapper";

// ─── Types ────────────────────────────────────────────────────────────────────

type AddForm = {
  ingredientId: string;
  amount: string;
  unit: string;
  notes: string;
};
type AddError = Partial<Record<keyof AddForm, string>>;
type EditForm = { amount: string; unit: string; notes: string };
type EditError = Partial<Record<keyof EditForm, string>>;

const validateAdd = (f: AddForm): AddError => {
  const e: AddError = {};
  if (!f.ingredientId) e.ingredientId = "Chọn nguyên liệu";
  if (!f.amount.trim() || isNaN(Number(f.amount)) || Number(f.amount) <= 0)
    e.amount = "Số lượng phải là số dương";
  if (!f.unit.trim()) e.unit = "Đơn vị không được để trống";
  return e;
};

const validateEdit = (f: EditForm): EditError => {
  const e: EditError = {};
  if (!f.amount.trim() || isNaN(Number(f.amount)) || Number(f.amount) <= 0)
    e.amount = "Số lượng phải là số dương";
  if (!f.unit.trim()) e.unit = "Đơn vị không được để trống";
  return e;
};

// ─── RuleBadges ───────────────────────────────────────────────────────────────

const RuleBadges = ({ rules }: { rules: IngredientRuleType[] }) => (
  <div className="space-y-1.5 mt-2">
    {rules.map((rule) => {
      const t = getRuleTypeConfig(rule.ruleType);
      const s = getRuleSeverityConfig(rule.severity);
      const a = getRuleActionConfig(rule.action);
      return (
        <div
          key={rule.ingredientRuleId}
          className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-2 space-y-1"
        >
          <div className="flex flex-wrap gap-1">
            <span
              className={`px-1.5 py-0.5 rounded-full font-medium ${t.bgColor} ${t.textColor}`}
            >
              {t.label}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full font-medium ${s.bgColor} ${s.textColor}`}
            >
              {s.label}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full font-medium ${a.bgColor} ${a.textColor}`}
            >
              {a.label}
            </span>
          </div>
          <p className="text-gray-500">{rule.ruleDescription}</p>
          <p className="font-mono text-gray-400">
            {getRuleOperatorLabel(rule.operator)} {rule.value}
          </p>
        </div>
      );
    })}
    {rules.length === 0 && (
      <p className="text-xs text-gray-300 italic">Không có quy tắc</p>
    )}
  </div>
);

// ─── IngredientCard ───────────────────────────────────────────────────────────

type CardProps = {
  si: SupplementIngredientType;
  rulesMap: Record<string, IngredientRuleType[]>;
  onLoadRules: (id: string) => void;
  onUpdate: (id: string, payload: UpdateSupplementIngredientReq) => void;
  onDelete: (id: string, name: string) => void;
};

const IngredientCard = ({
  si,
  rulesMap,
  onLoadRules,
  onUpdate,
  onDelete,
}: CardProps) => {
  const [editing, setEditing] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    amount: String(si.amount),
    unit: si.unit,
    notes: si.notes ?? "",
  });
  const [editErrors, setEditErrors] = useState<EditError>({});

  const rules = rulesMap[si.ingredient.ingredientId] ?? null;

  const handleSave = () => {
    const errs = validateEdit(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onUpdate(si.supplementIngredientId, {
      amount: Number(editForm.amount),
      unit: editForm.unit.trim(),
      notes: editForm.notes.trim(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      amount: String(si.amount),
      unit: si.unit,
      notes: si.notes ?? "",
    });
    setEditErrors({});
    setEditing(false);
  };

  return (
    <div className="border border-orange-100 rounded-xl p-4 space-y-2 bg-orange-50/30">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-700">{si.ingredient.name}</p>
          {!editing && (
            <p className="text-sm text-gray-500">
              {si.amount} {si.unit}
              {si.notes ? ` · ${si.notes}` : ""}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() =>
                  onDelete(si.supplementIngredientId, si.ingredient.name)
                }
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Field>
            <Label>Số lượng</Label>
            <Input
              type="number"
              min={0}
              value={editForm.amount}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, amount: e.target.value }))
              }
            />
            {editErrors.amount && (
              <p className="text-xs text-red-500">{editErrors.amount}</p>
            )}
          </Field>
          <Field>
            <Label>Đơn vị</Label>
            <Input
              value={editForm.unit}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, unit: e.target.value }))
              }
            />
            {editErrors.unit && (
              <p className="text-xs text-red-500">{editErrors.unit}</p>
            )}
          </Field>
          <Field className="col-span-2">
            <Label>Ghi chú</Label>
            <Input
              value={editForm.notes}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, notes: e.target.value }))
              }
            />
          </Field>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!showRules && !rules) onLoadRules(si.ingredient.ingredientId);
          setShowRules((p) => !p);
        }}
        className="flex items-center gap-1 text-xs text-orange-600 hover:underline"
      >
        {showRules ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {rules === null ? "Tải quy tắc" : `Quy tắc (${rules.length})`}
      </button>

      {showRules && rules && <RuleBadges rules={rules} />}
    </div>
  );
};

// ─── IngredientSection ────────────────────────────────────────────────────────

type Props = {
  suppIngredients: SupplementIngredientType[];
  allIngredients: IngredientType[];
  usedIngredientIds: string[];
  rulesMap: Record<string, IngredientRuleType[]>;
  onLoadRules: (id: string) => void;
  onCreate: (p: {
    ingredientId: string;
    amount: number;
    unit: string;
    notes: string;
  }) => void;
  onUpdate: (id: string, p: UpdateSupplementIngredientReq) => void;
  onDelete: (id: string, name: string) => void;
};

const INITIAL_ADD: AddForm = {
  ingredientId: "",
  amount: "",
  unit: "",
  notes: "",
};

const IngredientSection = ({
  suppIngredients,
  allIngredients,
  usedIngredientIds,
  rulesMap,
  onLoadRules,
  onCreate,
  onUpdate,
  onDelete,
}: Props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(INITIAL_ADD);
  const [addErrors, setAddErrors] = useState<AddError>({});

  const available = allIngredients.filter(
    (i) => !usedIngredientIds.includes(i.ingredientId),
  );

  const handleAddIngredient = (field: keyof AddForm, value: string) => {
    setAddForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmitAdd = () => {
    const errs = validateAdd(addForm);
    setAddErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onCreate({
      ingredientId: addForm.ingredientId,
      amount: Number(addForm.amount),
      unit: addForm.unit.trim(),
      notes: addForm.notes.trim(),
    });
    setAddForm(INITIAL_ADD);
    setAddErrors({});
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-orange-700">
          Nguyên liệu ({suppIngredients.length})
        </h2>
        {available.length > 0 && (
          <button
            onClick={() => setShowAdd((p) => !p)}
            className="flex items-center gap-1.5 text-sm text-orange-600 font-medium hover:text-orange-700"
          >
            <Plus size={16} /> Thêm nguyên liệu
          </button>
        )}
      </div>

      {showAdd && (
        <div className="border-2 border-dashed border-orange-200 rounded-xl p-4 space-y-3 bg-orange-50/20">
          <p className="text-sm font-medium text-orange-700">Nguyên liệu mới</p>
          <Field>
            <Label>Nguyên liệu</Label>
            <select
              value={addForm.ingredientId}
              onChange={(e) =>
                handleAddIngredient("ingredientId", e.target.value)
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              <option value="">— Chọn nguyên liệu —</option>
              {available.map((i) => (
                <option key={i.ingredientId} value={i.ingredientId}>
                  {i.name}
                </option>
              ))}
            </select>
            {addErrors.ingredientId && (
              <p className="text-xs text-red-500">{addErrors.ingredientId}</p>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Số lượng</Label>
              <Input
                type="number"
                min={0}
                value={addForm.amount}
                onChange={(e) => handleAddIngredient("amount", e.target.value)}
                placeholder="500"
              />
              {addErrors.amount && (
                <p className="text-xs text-red-500">{addErrors.amount}</p>
              )}
            </Field>
            <Field>
              <Label>Đơn vị</Label>
              <Input
                value={addForm.unit}
                onChange={(e) => handleAddIngredient("unit", e.target.value)}
                placeholder="mg, g, IU"
              />
              {addErrors.unit && (
                <p className="text-xs text-red-500">{addErrors.unit}</p>
              )}
            </Field>
            <Field className="col-span-2">
              <Label>Ghi chú</Label>
              <Input
                value={addForm.notes}
                onChange={(e) => handleAddIngredient("notes", e.target.value)}
                placeholder="Ghi chú (tuỳ chọn)"
              />
            </Field>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                setAddForm(INITIAL_ADD);
                setAddErrors({});
              }}
            >
              Huỷ
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmitAdd}
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700"
            >
              Thêm
            </Button>
          </div>
        </div>
      )}

      {suppIngredients.length === 0 && !showAdd && (
        <p className="text-center py-6 text-gray-400 text-sm">
          Chưa có nguyên liệu nào
        </p>
      )}

      {suppIngredients.map((si) => (
        <IngredientCard
          key={si.supplementIngredientId}
          si={si}
          rulesMap={rulesMap}
          onLoadRules={onLoadRules}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default IngredientSection;
