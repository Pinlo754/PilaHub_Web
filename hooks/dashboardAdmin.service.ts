import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { DashboardType } from "@/utils/DashboardType";

export const DashboardAdminService = {
  // GET DASHBOARD
  getDashboard: async (): Promise<DashboardType> => {
    const res = await api.get<ApiResponse<DashboardType>>(
      `admin/dashboard/overview`,
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
