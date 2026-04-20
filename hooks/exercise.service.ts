import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  BodyPartType,
  CreateExerciseReq,
  ExerciseType,
  UpdateExerciseReq,
} from "@/utils/ExerciseType";

export const ExerciseService = {
  // GET ALL
  getAll: async (): Promise<ExerciseType[]> => {
    const res = await api.get<ApiResponse<ExerciseType[]>>(`/exercises`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET ALL BODY PART
  getAllBodyPart: async (): Promise<BodyPartType[]> => {
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

  // GET BY ID
  getById: async (exerciseId: string): Promise<ExerciseType> => {
    const res = await api.get<ApiResponse<ExerciseType>>(
      `/exercises/${exerciseId}`,
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

  // CREATE EXERCISE
  createExercise: async (payload: CreateExerciseReq): Promise<ExerciseType> => {
    const res = await api.post<ApiResponse<ExerciseType>>(
      `/exercises`,
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

  // UPDATE EXERCISE
  updateExercise: async (
    exerciseId: string,
    payload: UpdateExerciseReq,
  ): Promise<ExerciseType> => {
    const res = await api.put<ApiResponse<ExerciseType>>(
      `/exercises/${exerciseId}`,
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

  // DEACTIVE EXERCISE
  deactiveExercise: async (exerciseId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/exercises/${exerciseId}/deactivate`,
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

  // ACTIVE EXERCISE
  activeExercise: async (exerciseId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/exercises/${exerciseId}/activate`,
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

  // DELETE EXERCISE
  deleteExercise: async (exerciseId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/exercises/${exerciseId}`);

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
