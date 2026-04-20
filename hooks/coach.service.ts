import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { CoachType, FeedbackCoachType } from "@/utils/CoachType";

export const CoachService = {
  // GET ALL
  getAll: async (): Promise<CoachType[]> => {
    const res = await api.get<ApiResponse<CoachType[]>>(`/coaches`);

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
  getById: async (coachId: string): Promise<CoachType> => {
    const res = await api.get<ApiResponse<CoachType>>(`/coaches/${coachId}`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET FEEDBACKS BY COACH ID
  getFeedbacksByCoachId: async (
    coachId: string,
  ): Promise<FeedbackCoachType[]> => {
    const res = await api.get<ApiResponse<FeedbackCoachType[]>>(
      `/coach-feedbacks/coach/${coachId}`,
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

  // DEACTIVE COACH
  deactiveCoach: async (coachId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/coaches/${coachId}/deactivate`,
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

  // ACTIVE COACH
  activeCoach: async (coachId: string): Promise<CoachType> => {
    const res = await api.patch<ApiResponse<CoachType>>(
      `/coaches/${coachId}/activate`,
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
