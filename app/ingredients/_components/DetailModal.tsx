"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import {
  IngredientWithRulesType,
  CreateIngredientReq,
  UpdateIngredientReq,
  CreateIngredientRuleReq,
  RuleTypeEnum,
  RuleSeverityType,
  RuleActionType,
  RuleOperatorType,
} from "@/utils/IngredientType";
import {
  getRuleActionConfig,
  getRuleSeverityConfig,
  getRuleTypeConfig,
  getRuleOperatorLabel,
} from "@/utils/uiMapper";
import RuleModal, { RuleFormData } from "./RuleModal";

// ---- RULE FORM ROW TYPE ----
type RuleFormRow = {
  _tempId: string;
  ruleId?: string; // present = existing rule (update)
  isNew?: boolean; // true = added during edit session → call createIngredientRule
  ruleType: RuleTypeEnum;
  ruleDescription: string;
  operator: RuleOperatorType;
  value: string;
  severity: RuleSeverityType;
  action: RuleActionType;
};

const mapFormDataToRow = (
  data: RuleFormData,
  existing?: RuleFormRow,
): RuleFormRow => ({
  _tempId: existing?._tempId ?? crypto.randomUUID(),
  ruleId: existing?.ruleId,
  isNew: existing?.isNew ?? true,
  ...data,
});

// ---- NAME VALIDATION ----
const validateName = (name: string) =>
  name.trim() ? undefined : "Tên nguyên liệu không được để trống";

// ---- RULE LIST PAGINATION ----
const RULES_PER_PAGE = 3;

// ---- PROPS ----
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient?: IngredientWithRulesType | null;
  onCreate: (payload: CreateIngredientReq) => void;
  onUpdate: (
    ingredientId: string,
    payload: UpdateIngredientReq,
    newRules: CreateIngredientRuleReq[],
  ) => void;
};

const DetailModal = ({
  open,
  onOpenChange,
  ingredient,
  onCreate,
  onUpdate,
}: Props) => {
  const isEditMode = !!ingredient;

  // ---- NAME ----
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const nameError = nameTouched ? validateName(name) : undefined;

  // ---- RULES ----
  const [rules, setRules] = useState<RuleFormRow[]>([]);
  const [initialName, setInitialName] = useState("");
  const [initialRulesJson, setInitialRulesJson] = useState("");

  // ---- RULE LIST PAGINATION ----
  const [rulePage, setRulePage] = useState(1);
  const ruleTotalPages = Math.max(1, Math.ceil(rules.length / RULES_PER_PAGE));
  const safePage = Math.min(rulePage, ruleTotalPages);
  const pagedRules = rules.slice(
    (safePage - 1) * RULES_PER_PAGE,
    safePage * RULES_PER_PAGE,
  );

  // ---- ADD/EDIT RULE MODAL ----
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleFormRow | null>(null);

  // ---- DIRTY / VALID ----
  const isDirty =
    !isEditMode ||
    name !== initialName ||
    JSON.stringify(rules) !== initialRulesJson;

  const isValid = !validateName(name);

  // ---- EFFECTS ----
  useEffect(() => {
    if (open) {
      if (ingredient) {
        setName(ingredient.name);
        const mapped: RuleFormRow[] = ingredient.ingredientRules.map((r) => ({
          _tempId: r.ingredientRuleId,
          ruleId: r.ingredientRuleId,
          isNew: false,
          ruleType: r.ruleType,
          ruleDescription: r.ruleDescription,
          operator: r.operator,
          value: r.value,
          severity: r.severity,
          action: r.action,
        }));
        setRules(mapped);
        setInitialName(ingredient.name);
        setInitialRulesJson(JSON.stringify(mapped));
      } else {
        setName("");
        setRules([]);
        setInitialName("");
        setInitialRulesJson("[]");
      }
      setNameTouched(false);
      setRulePage(1);
      setShowAddRuleModal(false);
      setEditingRule(null);
    }
  }, [open, ingredient]);

  // Keep page in bounds when rules change
  useEffect(() => {
    if (rulePage > ruleTotalPages) setRulePage(ruleTotalPages);
  }, [rules.length]);

  // ---- HANDLERS ----
  const handleAddRuleConfirm = (data: RuleFormData) => {
    if (editingRule) {
      // Edit existing row
      setRules((prev) =>
        prev.map((r) =>
          r._tempId === editingRule._tempId
            ? mapFormDataToRow(data, editingRule)
            : r,
        ),
      );
    } else {
      // Add new row — jump to last page after adding
      const newRow = mapFormDataToRow(data);
      setRules((prev) => {
        const next = [...prev, newRow];
        const newPage = Math.ceil(next.length / RULES_PER_PAGE);
        setRulePage(newPage);
        return next;
      });
    }
    setShowAddRuleModal(false);
    setEditingRule(null);
  };

  const openAddRule = () => {
    setEditingRule(null);
    setShowAddRuleModal(true);
  };

  const openEditRule = (rule: RuleFormRow) => {
    setEditingRule(rule);
    setShowAddRuleModal(true);
  };

  const removeRule = (tempId: string) => {
    setRules((prev) => prev.filter((r) => r._tempId !== tempId));
  };

  const handleSubmit = () => {
    setNameTouched(true);
    if (validateName(name) || !isDirty) return;

    if (isEditMode && ingredient) {
      // Separate existing vs new rules
      const existingRules = rules.filter((r) => !r.isNew);
      const newRules = rules.filter((r) => r.isNew);

      const payload: UpdateIngredientReq = {
        name,
        ingredientRules: existingRules.map((r) => ({
          ruleId: r.ruleId!,
          ruleType: r.ruleType,
          ruleDescription: r.ruleDescription,
          operator: r.operator,
          value: r.value,
          severity: r.severity,
          action: r.action,
        })),
      };

      const newRulePayloads: CreateIngredientRuleReq[] = newRules.map((r) => ({
        ruleType: r.ruleType,
        ruleDescription: r.ruleDescription,
        operator: r.operator,
        value: r.value,
        severity: r.severity,
        action: r.action,
      }));

      onUpdate(ingredient.ingredientId, payload, newRulePayloads);
    } else {
      const payload: CreateIngredientReq = {
        name,
        ingredientRules: rules.map((r) => ({
          ruleType: r.ruleType,
          ruleDescription: r.ruleDescription,
          operator: r.operator,
          value: r.value,
          severity: r.severity,
          action: r.action,
        })),
      };
      onCreate(payload);
    }
  };

  // ---- RENDER ----
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-700">
              {isEditMode ? "Chi tiết nguyên liệu" : "Tạo nguyên liệu mới"}
            </DialogTitle>
          </DialogHeader>

          {/* Fixed-layout body — NO overflow-y-auto on the whole modal */}
          <div className="space-y-5">
            {/* Ingredient Name */}
            <FieldGroup>
              <Field>
                <Label>Tên nguyên liệu</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameTouched && !validateName(e.target.value)) {
                      setNameTouched(false);
                    }
                  }}
                  onBlur={() => setNameTouched(true)}
                  placeholder="Nhập tên nguyên liệu"
                />
                {nameError && (
                  <p className="text-xs text-red-500">{nameError}</p>
                )}
              </Field>
            </FieldGroup>

            {/* Rules Section */}
            <div>
              {/* Section header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Quy tắc áp dụng
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {rules.length}
                  </span>
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openAddRule}
                  className="flex items-center gap-1 text-orange-700 border-orange-300 hover:bg-orange-50 text-xs px-3 py-1 h-auto"
                >
                  <Plus size={14} /> Thêm quy tắc
                </Button>
              </div>

              {/* Rule list — fixed height, internal scroll */}
              <div className="min-h-[180px]">
                {rules.length === 0 ? (
                  <div className="flex items-center justify-center h-[180px] border-2 border-dashed border-orange-100 rounded-xl text-gray-400 text-sm">
                    Chưa có quy tắc nào. Nhấn "Thêm quy tắc" để bắt đầu.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pagedRules.map((rule, idx) => {
                      const typeConfig = getRuleTypeConfig(rule.ruleType);
                      const severityConfig = getRuleSeverityConfig(
                        rule.severity,
                      );
                      const actionConfig = getRuleActionConfig(rule.action);
                      const operatorLabel = getRuleOperatorLabel(rule.operator);
                      const globalIdx =
                        (safePage - 1) * RULES_PER_PAGE + idx + 1;

                      return (
                        <div
                          key={rule._tempId}
                          onClick={() => openEditRule(rule)}
                          className="flex flex-col gap-2 border border-orange-100 rounded-xl px-3 py-3 bg-orange-50/40 hover:bg-orange-50 transition cursor-pointer"
                        >
                          {/* Row 1: Index + Type Badge + Operator + Value + New Badge */}
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-xs text-gray-400 font-medium w-6 shrink-0">
                                #{globalIdx}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${typeConfig.bgColor} ${typeConfig.textColor}`}
                              >
                                {typeConfig.label}
                              </span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-500">
                                  {operatorLabel}
                                </span>
                                <span className="font-semibold text-gray-700 truncate">
                                  {rule.value}
                                </span>
                              </div>
                            </div>
                            {rule.isNew && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium shrink-0">
                                Mới
                              </span>
                            )}
                          </div>

                          {/* Row 3: Severity + Action Badges */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                              Mức độ nghiêm trọng
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityConfig.bgColor} ${severityConfig.textColor}`}
                            >
                              {severityConfig.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">Hành động</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionConfig.bgColor} ${actionConfig.textColor}`}
                            >
                              {actionConfig.label}
                            </span>
                          </div>

                          {/* Row 4: Description + Actions */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs text-gray-500 line-clamp-1 flex-1">
                              {rule.ruleDescription || (
                                <span className="italic text-gray-300">
                                  Chưa có mô tả
                                </span>
                              )}
                            </span>
                            {(!isEditMode || rule.isNew) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRule(rule._tempId);
                                }}
                                className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition shrink-0"
                                title="Xoá"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rule list pagination */}
              {ruleTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() => setRulePage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1 rounded-md hover:bg-orange-100 disabled:opacity-40 transition"
                  >
                    <ChevronLeft size={16} className="text-orange-700" />
                  </button>
                  <span className="text-xs text-gray-500">
                    {safePage} / {ruleTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setRulePage((p) => Math.min(ruleTotalPages, p + 1))
                    }
                    disabled={safePage === ruleTotalPages}
                    className="p-1 rounded-md hover:bg-orange-100 disabled:opacity-40 transition"
                  >
                    <ChevronRight size={16} className="text-orange-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Read-only info in edit mode */}
            {isEditMode && ingredient && (
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo</span>
                  <span>
                    {new Date(ingredient.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật lần cuối</span>
                  <span>
                    {new Date(ingredient.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isEditMode ? !isDirty || !isValid : !isValid}
              variant="outline"
              className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              {isEditMode ? "Lưu thay đổi" : "Tạo nguyên liệu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nested Add/Edit Rule Modal */}
      <RuleModal
        open={showAddRuleModal}
        onOpenChange={(open) => {
          setShowAddRuleModal(open);
          if (!open) setEditingRule(null);
        }}
        initialData={
          editingRule
            ? {
                ruleType: editingRule.ruleType,
                ruleDescription: editingRule.ruleDescription,
                operator: editingRule.operator,
                value: editingRule.value,
                severity: editingRule.severity,
                action: editingRule.action,
              }
            : null
        }
        onConfirm={handleAddRuleConfirm}
      />
    </>
  );
};

export default DetailModal;
