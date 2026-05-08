import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreatePurposeReq,
  PurposeType,
  UpdatePurposeReq,
} from "@/utils/PurposeType";

export const PurposeService = {
  // GET ALL
  getAll: async (): Promise<PurposeType[]> => {
    const res = await api.get<ApiResponse<PurposeType[]>>(`/purposes`);

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
  searchByName: async (name: string): Promise<PurposeType[]> => {
    const res = await api.get<ApiResponse<PurposeType[]>>(`/purposes/search`, {
      params: {
        name,
      },
    });

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE PURPOSE
  createPurpose: async (payload: CreatePurposeReq): Promise<PurposeType> => {
    const res = await api.post<ApiResponse<PurposeType>>(`/purposes`, payload);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE PURPOSE
  updatePurpose: async (
    purposeId: string,
    payload: UpdatePurposeReq,
  ): Promise<PurposeType> => {
    const res = await api.put<ApiResponse<PurposeType>>(
      `/purposes/${purposeId}`,
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

  // DEACTIVE PURPOSE
  deactivePurpose: async (purposeId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/purposes/${purposeId}/deactivate`,
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

  // ACTIVE PURPOSE
  activePurpose: async (purposeId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/purposes/${purposeId}/activate`,
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
