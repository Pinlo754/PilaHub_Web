import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { LiveSessionType } from "@/utils/LiveSessionType";

export const LiveSessionService = {
  // GET BY ID
  getById: async (liveSessionId: string): Promise<LiveSessionType> => {
    const res = await api.get<ApiResponse<LiveSessionType>>(
      `/live-sessions/${liveSessionId}`,
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

  // GET RECORD URL
  getRecordUrl: async (bookingId: string): Promise<string> => {
    const res = await api.get<ApiResponse<string>>(
      `/live-sessions/${bookingId}/recording-url`,
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
