import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateReturnReasonReq,
  ReturnReasonType,
  UpdateReturnReasonReq,
} from "@/utils/ReturnReasonType";

export const ReturnReasonService = {
  // GET ALL
  getAll: async (): Promise<ReturnReasonType[]> => {
    const res =
      await api.get<ApiResponse<ReturnReasonType[]>>(`/return-reasons`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // SEARCH BY KEYWORD
  searchByKeyword: async (keyword: string): Promise<ReturnReasonType[]> => {
    const res = await api.get<ApiResponse<ReturnReasonType[]>>(
      `/return-reasons/search`,
      {
        params: {
          keyword,
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

  // CREATE RETURN REASON
  createReturnReason: async (
    payload: CreateReturnReasonReq,
  ): Promise<ReturnReasonType> => {
    const res = await api.post<ApiResponse<ReturnReasonType>>(
      `/return-reasons`,
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

  // UPDATE RETURN REASON
  updateReturnReason: async (
    returnReasonId: string,
    payload: UpdateReturnReasonReq,
  ): Promise<ReturnReasonType> => {
    const res = await api.put<ApiResponse<ReturnReasonType>>(
      `/return-reasons/${returnReasonId}`,
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

  // DELETE RETURN REASON
  deleteReturnReason: async (returnReasonId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/return-reasons/${returnReasonId}`,
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
