import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateBodyPartReq,
  BodyPartType,
  UpdateBodyPartReq,
} from "@/utils/BodyPartType";

export const BodyPartService = {
  // GET ALL
  getAll: async (): Promise<BodyPartType[]> => {
    const res = await api.get<ApiResponse<BodyPartType[]>>(`/body-parts`);

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
  searchByName: async (name: string): Promise<BodyPartType[]> => {
    const res = await api.get<ApiResponse<BodyPartType[]>>(
      `/body-parts/search`,
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

  // CREATE BODY PART
  createBodyPart: async (payload: CreateBodyPartReq): Promise<BodyPartType> => {
    const res = await api.post<ApiResponse<BodyPartType>>(
      `/body-parts`,
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

  // UPDATE BODY PART
  updateBodyPart: async (
    bodyPartId: string,
    payload: UpdateBodyPartReq,
  ): Promise<BodyPartType> => {
    const res = await api.put<ApiResponse<BodyPartType>>(
      `/body-parts/${bodyPartId}`,
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

  // DELETE BODY PART
  deleteBodyPart: async (bodyPartId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/body-parts/${bodyPartId}`);

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
