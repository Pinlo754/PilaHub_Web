import { PaginationReq } from "@/utils/AccountType";
import api from "./AxiosInstance";
import { ApiResponse, PageResponse } from "@/utils/ApiResType";
import {
  FitnessGoalType,
  CreateFitnessGoalReq,
  UpdateFitnessGoalReq,
  PurposeType,
} from "@/utils/FitnessGoalType";

export const FitnessGoalService = {
  // GET ALL
  getAll: async (
    payload?: PaginationReq,
  ): Promise<PageResponse<FitnessGoalType>> => {
    const res = await api.get<ApiResponse<PageResponse<FitnessGoalType>>>(
      `/fitness-goals`,
      {
        params: payload,
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

  // GET ALL PURPOSE
  getAllPurpose: async (): Promise<PurposeType[]> => {
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

  // CREATE FITNESS GOAL
  createFitnessGoal: async (
    payload: CreateFitnessGoalReq,
  ): Promise<FitnessGoalType> => {
    const res = await api.post<ApiResponse<FitnessGoalType>>(
      `/fitness-goals`,
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

  // UPDATE FITNESS GOAL
  updateFitnessGoal: async (
    fitnessGoalId: string,
    payload: UpdateFitnessGoalReq,
  ): Promise<FitnessGoalType> => {
    const res = await api.put<ApiResponse<FitnessGoalType>>(
      `/fitness-goals/${fitnessGoalId}`,
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

  // DEACTIVE FITNESS GOAL
  deactiveFitnessGoal: async (fitnessGoalId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/fitness-goals/${fitnessGoalId}/deactivate`,
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

  // ACTIVE FITNESS GOAL
  activeFitnessGoal: async (fitnessGoalId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/fitness-goals/${fitnessGoalId}/activate`,
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
