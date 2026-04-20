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
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RULE_TYPE,
  RULE_SEVERITY,
  RULE_ACTION,
  RULE_OPERATOR,
  RuleTypeEnum,
  RuleSeverityType,
  RuleActionType,
  RuleOperatorType,
  CreateIngredientRuleReq,
} from "@/utils/IngredientType";
import {
  RULE_TYPE_SELECT_OPTIONS,
  RULE_SEVERITY_SELECT_OPTIONS,
  RULE_ACTION_SELECT_OPTIONS,
  RULE_OPERATOR_SELECT_OPTIONS,
  getRuleTypeConfig,
  getRuleSeverityConfig,
  getRuleActionConfig,
} from "@/utils/uiMapper";

export type RuleFormData = {
  ruleType: RuleTypeEnum;
  ruleDescription: string;
  operator: RuleOperatorType;
  value: string;
  severity: RuleSeverityType;
  action: RuleActionType;
};

type RuleFormError = Partial<Record<keyof RuleFormData, string>>;

const EMPTY_RULE: RuleFormData = {
  ruleType: RULE_TYPE.CONDITION,
  ruleDescription: "",
  operator: RULE_OPERATOR.EQUALS,
  value: "",
  severity: RULE_SEVERITY.LOW,
  action: RULE_ACTION.WARN,
};

const validateRule = (form: RuleFormData): RuleFormError => {
  const errors: RuleFormError = {};
  if (!form.ruleDescription.trim())
    errors.ruleDescription = "Không được để trống";
  if (!form.value.trim()) errors.value = "Không được để trống";
  return errors;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RuleFormData | null;
  onConfirm: (data: RuleFormData) => void;
};

const RuleModal = ({ open, onOpenChange, initialData, onConfirm }: Props) => {
  const [form, setForm] = useState<RuleFormData>(EMPTY_RULE);
  const [touched, setTouched] = useState<
    Partial<Record<keyof RuleFormData, boolean>>
  >({});
  const [errors, setErrors] = useState<RuleFormError>({});

  const typeConfig = getRuleTypeConfig(form.ruleType);
  const severityConfig = getRuleSeverityConfig(form.severity);
  const actionConfig = getRuleActionConfig(form.action);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? EMPTY_RULE);
      setTouched({});
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = <K extends keyof RuleFormData>(
    key: K,
    value: RuleFormData[K],
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (touched[key]) {
        const errs = validateRule(updated);
        setErrors((prev) => {
          const next = { ...prev };
          if (errs[key]) next[key] = errs[key];
          else delete next[key];
          return next;
        });
      }
      return updated;
    });
  };

  const handleBlur = (key: keyof RuleFormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateRule(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[key]) next[key] = errs[key];
      else delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof RuleFormData, boolean>,
    );
    setTouched(allTouched);
    const errs = validateRule(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onConfirm(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-orange-700">
            {initialData ? "Chỉnh sửa quy tắc" : "Thêm quy tắc mới"}
          </DialogTitle>
        </DialogHeader>

        {/* Preview badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
          >
            {typeConfig.label}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityConfig.bgColor} ${severityConfig.textColor}`}
          >
            {severityConfig.label}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionConfig.bgColor} ${actionConfig.textColor}`}
          >
            {actionConfig.label}
          </span>
        </div>

        <div className="space-y-3">
          {/* Row 1: ruleType + operator */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Loại quy tắc</Label>
              <Select
                value={form.ruleType}
                onValueChange={(v) =>
                  handleChange("ruleType", v as RuleTypeEnum)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_TYPE_SELECT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Toán tử</Label>
              <Select
                value={form.operator}
                onValueChange={(v) =>
                  handleChange("operator", v as RuleOperatorType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_OPERATOR_SELECT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Row 2: value */}
          <Field>
            <Label>Giá trị</Label>
            <Input
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              onBlur={() => handleBlur("value")}
              placeholder="Nhập giá trị"
            />
            {touched.value && errors.value && (
              <p className="text-xs text-red-500">{errors.value}</p>
            )}
          </Field>

          {/* Row 3: severity + action */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Mức độ</Label>
              <Select
                value={form.severity}
                onValueChange={(v) =>
                  handleChange("severity", v as RuleSeverityType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_SEVERITY_SELECT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Hành động</Label>
              <Select
                value={form.action}
                onValueChange={(v) =>
                  handleChange("action", v as RuleActionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_ACTION_SELECT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Row 4: description */}
          <Field>
            <Label>Mô tả quy tắc</Label>
            <Input
              value={form.ruleDescription}
              onChange={(e) => handleChange("ruleDescription", e.target.value)}
              onBlur={() => handleBlur("ruleDescription")}
              placeholder="Nhập mô tả quy tắc"
            />
            {touched.ruleDescription && errors.ruleDescription && (
              <p className="text-xs text-red-500">{errors.ruleDescription}</p>
            )}
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-200 hover:text-orange-700"
          >
            {initialData ? "Lưu thay đổi" : "Thêm quy tắc"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleModal;
