import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";



export const TicketService = {

  async getAllType(): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/ticket-types`);
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

  async createTicket(payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/tickets`, payload);

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