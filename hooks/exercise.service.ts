import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { ExerciseType } from "@/utils/ExerciseType";

export const ExerciseService = {
  // GET ALL
  getAll: async (): Promise<ExerciseType[]> => {
    const res = await api.get<ApiResponse<ExerciseType[]>>(`/exercises/active`);

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
