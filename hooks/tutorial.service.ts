import {
  CreateTutorialReq,
  TutorialType,
  UpdateTutorialReq,
} from "@/utils/TutorialType";
import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";

export const TutorialService = {
  // GET BY ID
  getById: async (exerciseId: string): Promise<TutorialType> => {
    const res = await api.get<ApiResponse<TutorialType>>(
      `/tutorials/exercise/${exerciseId}`,
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

  // CREATE TUTORIAL
  createTutorial: async (payload: CreateTutorialReq): Promise<TutorialType> => {
    const res = await api.post<ApiResponse<TutorialType>>(
      `/tutorials`,
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

  // UPDATE TUTORIAL
  updateTutorial: async (
    tutorialId: string,
    payload: UpdateTutorialReq,
  ): Promise<TutorialType> => {
    const res = await api.put<ApiResponse<TutorialType>>(
      `/tutorials/${tutorialId}`,
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
};
