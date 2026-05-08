import { IngredientType } from "./IngredientType";

export type SupplementIngredientType = {
  supplementIngredientId: string;
  supplementId: string;
  ingredient: IngredientType;
  amount: number;
  unit: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplementIngredientReq = {
  supplementId: string;
  ingredientId: string;
  amount: number;
  unit: string;
  notes: string;
};

export type UpdateSupplementIngredientReq = Omit<
  CreateSupplementIngredientReq,
  "supplementId" | "ingredientId"
>;
