import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateSupplementPurposeReq,
  SupplementPurposeType,
  UpdateSupplementPurposeReq,
} from "@/utils/SupplementPurposeType";

export const SupplementPurposeService = {
  // GET BY SUPPLEMENT ID
  getBySupplementId: async (
    supplementId: string,
  ): Promise<SupplementPurposeType[]> => {
    const res = await api.get<ApiResponse<SupplementPurposeType[]>>(
      `/supplement-purposes/supplement/${supplementId}`,
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
    purposeId: string,
  ): Promise<boolean> => {
    const res = await api.get<ApiResponse<boolean>>(
      `/supplement-purposes/check`,
      {
        params: {
          supplementId: supplementId,
          purposeId: purposeId,
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
  createSupplementPurpose: async (
    payload: CreateSupplementPurposeReq,
  ): Promise<SupplementPurposeType> => {
    const res = await api.post<ApiResponse<SupplementPurposeType>>(
      `/supplement-purposes`,
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
  updateSupplementPurpose: async (
    supplementPurposeId: string,
    payload: UpdateSupplementPurposeReq,
  ): Promise<SupplementPurposeType> => {
    const res = await api.put<ApiResponse<SupplementPurposeType>>(
      `/supplement-purposes/${supplementPurposeId}`,
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
  deleteSupplementPurpose: async (
    supplementPurposeId: string,
  ): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/supplement-purposes/${supplementPurposeId}`,
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
