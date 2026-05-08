import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";
import {
  CreateSupplementReq,
  SupplementType,
  UpdateSupplementReq,
} from "@/utils/SupplementType";

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

  // GET ALL
  getAll: async (): Promise<SupplementType[]> => {
    const res = await api.get<ApiResponse<SupplementType[]>>(`/supplements`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // SEARCH BY NAME
  searchByName: async (name: string): Promise<SupplementType[]> => {
    const res = await api.get<ApiResponse<SupplementType[]>>(
      `/supplements/search`,
      {
        params: {
          name,
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

  // CREATE SUPPLEMENT
  createSupplement: async (
    payload: CreateSupplementReq,
  ): Promise<SupplementType> => {
    const res = await api.post<ApiResponse<SupplementType>>(
      `/supplements`,
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

  // UPDATE SUPPLEMENT
  updateSupplement: async (
    supplementId: string,
    payload: UpdateSupplementReq,
  ): Promise<SupplementType> => {
    const res = await api.put<ApiResponse<SupplementType>>(
      `/supplements/${supplementId}`,
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

  // DEACTIVE SUPPLEMENT
  deactiveSupplement: async (supplementId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/supplements/${supplementId}/deactivate`,
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

  // ACTIVE SUPPLEMENT
  activeSupplement: async (supplementId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/supplements/${supplementId}/activate`,
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

  // DELETE SUPPLEMENT
  deleteSupplement: async (supplementId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/supplements/${supplementId}`,
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
