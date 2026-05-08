import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateSupplementIngredientReq,
  SupplementIngredientType,
  UpdateSupplementIngredientReq,
} from "@/utils/SupplementIngredientType";

export const SupplementIngredientService = {
  // GET BY SUPPLEMENT ID
  getBySupplementId: async (
    supplementId: string,
  ): Promise<SupplementIngredientType[]> => {
    const res = await api.get<ApiResponse<SupplementIngredientType[]>>(
      `/supplement-ingredients/supplement/${supplementId}`,
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

  // CHECK RELATIONSHIP
  checkRelationship: async (
    supplementId: string,
    ingredientId: string,
  ): Promise<boolean> => {
    const res = await api.get<ApiResponse<boolean>>(
      `/supplement-ingredients/check`,
      {
        params: {
          supplementId: supplementId,
          ingredientId: ingredientId,
        },
      },
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

  // CREATE SUPPLEMENT INGREDIENT
  createSupplementIngredient: async (
    payload: CreateSupplementIngredientReq,
  ): Promise<SupplementIngredientType> => {
    const res = await api.post<ApiResponse<SupplementIngredientType>>(
      `/supplement-ingredients`,
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

  // UPDATE SUPPLEMENT INGREDIENT
  updateSupplementIngredient: async (
    supplementIngredientId: string,
    payload: UpdateSupplementIngredientReq,
  ): Promise<SupplementIngredientType> => {
    const res = await api.put<ApiResponse<SupplementIngredientType>>(
      `/supplement-ingredients/${supplementIngredientId}`,
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

  // DELETE SUPPLEMENT INGREDIENT
  deleteSupplementIngredient: async (
    supplementIngredientId: string,
  ): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/supplement-ingredients/${supplementIngredientId}`,
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
