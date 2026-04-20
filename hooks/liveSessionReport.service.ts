import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  LiveSessionReportType,
  ResolveReportReq,
} from "@/utils/LiveSessionReportType";
import { TraineeType } from "@/utils/TraineeType";

export const LiveSessionReportService = {
  // GET ALL
  getAll: async (): Promise<LiveSessionReportType[]> => {
    const res = await api.get<ApiResponse<LiveSessionReportType[]>>(
      `/live-session-reports`,
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

  // RESOLVE REPORT
  resolveReport: async (
    liveSessionId: string,
    payload: ResolveReportReq,
  ): Promise<LiveSessionReportType> => {
    const res = await api.put<ApiResponse<LiveSessionReportType>>(
      `/live-session-reports/${liveSessionId}/resolve`,
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
