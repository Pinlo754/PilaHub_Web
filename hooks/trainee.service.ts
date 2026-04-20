import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { TraineeType } from "@/utils/TraineeType";

export const TraineeService = {
  // GET ALL
  getAll: async (): Promise<TraineeType[]> => {
    const res = await api.get<ApiResponse<TraineeType[]>>(`/trainees`);

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
  getById: async (traineeId: string): Promise<TraineeType> => {
    const res = await api.get<ApiResponse<TraineeType>>(
      `/trainees/${traineeId}`,
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

  // DELETE TRAINEE
  deleteTrainee: async (traineeId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/trainees/${traineeId}`);

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
