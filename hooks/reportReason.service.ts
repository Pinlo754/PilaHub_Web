import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateReportReasonReq,
  ReportReasonType,
  UpdateReportReasonReq,
} from "@/utils/ReportReasonType";

export const ReportReasonService = {
  // GET ALL
  getAll: async (): Promise<ReportReasonType[]> => {
    const res =
      await api.get<ApiResponse<ReportReasonType[]>>(`/report-reasons`);

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
  searchByName: async (name: string): Promise<ReportReasonType[]> => {
    const res = await api.get<ApiResponse<ReportReasonType[]>>(
      `/report-reasons/search`,
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

  // CREATE REPORT REASON
  createReportReason: async (
    payload: CreateReportReasonReq,
  ): Promise<ReportReasonType> => {
    const res = await api.post<ApiResponse<ReportReasonType>>(
      `/report-reasons`,
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

  // UPDATE REPORT REASON
  updateReportReason: async (
    reportReasonId: string,
    payload: UpdateReportReasonReq,
  ): Promise<ReportReasonType> => {
    const res = await api.put<ApiResponse<ReportReasonType>>(
      `/report-reasons/${reportReasonId}`,
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

  // DEACTIVE REPORT REASON
  deactiveReportReason: async (reportReasonId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/report-reasons/${reportReasonId}/deactivate`,
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

  // ACTIVE REPORT REASON
  activeReportReason: async (reportReasonId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/report-reasons/${reportReasonId}/activate`,
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

  // DELETE REPORT REASON
  deleteReportReason: async (reportReasonId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/report-reasons/${reportReasonId}`,
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
