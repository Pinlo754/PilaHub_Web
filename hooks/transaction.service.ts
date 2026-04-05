import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";
import { TransactionType } from "@/utils/TransactionType";

export const TransactionService = {
  async getMyTransactions(): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/transactions/my-transactions`);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async getAllTransactions(): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/transactions`);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async getTransactionById(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/transactions/${id}`);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: null,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  // GET ALL
  getAll: async (): Promise<TransactionType[]> => {
    const res = await api.get<ApiResponse<TransactionType[]>>(`/transactions`);

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
