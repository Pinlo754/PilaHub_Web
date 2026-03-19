import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

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

};
