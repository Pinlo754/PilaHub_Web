import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateExerciseEquipmentReq,
  ExerciseEquipmentType,
  UpdateExerciseEquipmentReq,
} from "@/utils/ExerciseEquipmentType";

export const ExerciseEquipmentService = {
  // GET BY ID
  getById: async (exerciseId: string): Promise<ExerciseEquipmentType[]> => {
    const res = await api.get<ApiResponse<ExerciseEquipmentType[]>>(
      `/exercise-equipment/exercise/${exerciseId}`,
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

  // CREATE EXERCISE EQUIPMENT
  createExerciseEquipment: async (
    payload: CreateExerciseEquipmentReq,
  ): Promise<ExerciseEquipmentType> => {
    const res = await api.post<ApiResponse<ExerciseEquipmentType>>(
      `/exercise-equipment`,
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

  // UPDATE EXERCISE EQUIPMENT
  updateExerciseEquipment: async (
    exerciseEquipmentId: string,
    payload: UpdateExerciseEquipmentReq,
  ): Promise<ExerciseEquipmentType> => {
    const res = await api.put<ApiResponse<ExerciseEquipmentType>>(
      `/exercise-equipment/${exerciseEquipmentId}`,
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

  // DELETE EXERCISE EQUIPMENT
  deleteExerciseEquipment: async (
    exerciseEquipmentId: string,
  ): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/exercise-equipment/${exerciseEquipmentId}`,
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
