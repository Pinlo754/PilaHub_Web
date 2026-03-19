import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

export const SupplementService = {
  async getMySupplement(id: string): Promise<ApiResponse<any[]>> {
    try {
      //const res = await api.get(`/supplements/vendor/${id}`);
      const res = await api.get(`/supplements`);
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

  async getSupplementById(id: string): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/supplements/${id}`);

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
};