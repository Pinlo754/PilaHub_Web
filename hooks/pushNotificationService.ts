import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

export const PushNotificationService = {

  async SendPushNotification( payload: any): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.post(`/notifications/admin/broadcast`, payload);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

};
