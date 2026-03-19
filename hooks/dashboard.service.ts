import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

type DashboardParams = {
  startDate: string;
  endDate: string;
};

export const DashboardService = {
  async getDashboard(params: DashboardParams): Promise<ApiResponse<any>> {
    try {
      const { startDate, endDate } = params;

      const res = await api.get(
        `/shop-reports/dashboard`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      );

      console.log("Dashboard data:", res.data);
      return res.data;

    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: null,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },
};