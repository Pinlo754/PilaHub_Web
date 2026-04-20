export const RULE_ACTION = {
  BLOCK: "BLOCK",
  WARN: "WARN",
} as const;

export type RuleActionType = (typeof RULE_ACTION)[keyof typeof RULE_ACTION];

export const RULE_OPERATOR = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
  CONTAINS: "CONTAINS",
  NOT_CONTAINS: "NOT_CONTAINS",
  IN: "IN",
  NOT_IN: "NOT_IN",
} as const;

export type RuleOperatorType =
  (typeof RULE_OPERATOR)[keyof typeof RULE_OPERATOR];

export const RULE_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type RuleSeverityType =
  (typeof RULE_SEVERITY)[keyof typeof RULE_SEVERITY];

export const RULE_TYPE = {
  CONDITION: "CONDITION",
  AGE: "AGE",
  GENDER: "GENDER",
  WEIGHT: "WEIGHT",
  HEIGHT: "HEIGHT",
  DIFFICULTY_LEVEL: "DIFFICULTY_LEVEL",
  HEALTH_PROFILE: "HEALTH_PROFILE",
  MEDICATION: "MEDICATION",
  ALLERGY: "ALLERGY",
} as const;

export type RuleTypeEnum = (typeof RULE_TYPE)[keyof typeof RULE_TYPE];

export type IngredientType = {
  ingredientId: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IngredientRuleType = {
  ingredientRuleId: string;
  ingredientId: string;
  ruleType: RuleTypeEnum;
  ruleDescription: string;
  operator: RuleOperatorType;
  value: string;
  severity: RuleSeverityType;
  action: RuleActionType;
  createdAt: string;
  updatedAt: string;
};

export type IngredientWithRulesType = IngredientType & {
  ingredientRules: IngredientRuleType[];
};

export type CreateIngredientRuleReq = Omit<
  IngredientRuleType,
  "ingredientRuleId" | "ingredientId" | "createdAt" | "updatedAt"
>;

export type UpdateIngredientRuleReq = Omit<
  IngredientRuleType,
  "ingredientRuleId" | "ingredientId" | "createdAt" | "updatedAt"
> & {
  ruleId: string;
};

export type CreateIngredientReq = {
  name: string;
  ingredientRules: CreateIngredientRuleReq[];
};

export type UpdateIngredientReq = {
  name: string;
  ingredientRules: UpdateIngredientRuleReq[];
};
