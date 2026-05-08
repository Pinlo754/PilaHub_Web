import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

export interface Supplement {
  supplementId: string;
  name: string;
  description: string;
  brand: string;
  form: string;
  usageInstructions: string;
  benefits: string;
  sideEffects: string;
  contraindications: string;
  warnings: string;
  imageUrl: string;
  active: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}


export const SupplementService = {
  async getAll(): Promise<ApiResponse<Supplement[]>> {
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

  async getSupplementById(id: string): Promise<ApiResponse<Supplement | null>> {
    try {
      const res = await api.get(`/supplements/${id}`);

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