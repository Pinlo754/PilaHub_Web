import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  IngredientType,
  CreateIngredientReq,
  UpdateIngredientReq,
  IngredientWithRulesType,
  IngredientRuleType,
  CreateIngredientRuleReq,
} from "@/utils/IngredientType";

export const IngredientService = {
  // GET ALL
  getAll: async (): Promise<IngredientType[]> => {
    const res = await api.get<ApiResponse<IngredientType[]>>(`/ingredients`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET RULE BY ID
  getRuleById: async (ingredientId: string): Promise<IngredientRuleType[]> => {
    const res = await api.get<ApiResponse<IngredientRuleType[]>>(
      `/ingredient-rules/ingredient/${ingredientId}`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE INGREDIENT
  createIngredient: async (
    payload: CreateIngredientReq,
  ): Promise<IngredientWithRulesType> => {
    const res = await api.post<ApiResponse<IngredientWithRulesType>>(
      `/ingredients`,
      payload,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE INGREDIENT RULE
  createIngredientRule: async (
    ingredientId: string,
    payload: CreateIngredientRuleReq,
  ): Promise<IngredientWithRulesType> => {
    const res = await api.post<ApiResponse<IngredientWithRulesType>>(
      `/ingredients/${ingredientId}/rule/add`,
      payload,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE INGREDIENT
  updateIngredient: async (
    ingredientId: string,
    payload: UpdateIngredientReq,
  ): Promise<IngredientWithRulesType> => {
    const res = await api.patch<ApiResponse<IngredientWithRulesType>>(
      `/ingredients/${ingredientId}`,
      payload,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DEACTIVE INGREDIENT
  deactiveIngredient: async (ingredientId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/ingredients/${ingredientId}/deactivate`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // ACTIVE INGREDIENT
  activeIngredient: async (ingredientId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/ingredients/${ingredientId}/activate`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },
};
