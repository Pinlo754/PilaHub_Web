import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { TicketStatusType, TicketRes } from "@/utils/TicketType";

export const TicketService = {
  // --- CÁC PHƯƠNG THỨC TỪ DEV ---

  // LẤY TẤT CẢ LOẠI VÉ
  async getAllType(): Promise<any[]> {
    const res = await api.get<ApiResponse<any[]>>(`/ticket-types`);
    
    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }
    return res.data.data;
  },

  // TẠO VÉ MỚI
  async createTicket(payload: any): Promise<any> {
    const res = await api.post<ApiResponse<any>>(`/tickets`, payload);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }
    return res.data.data;
  },

  // --- CÁC PHƯƠNG THỨC TỪ MAIN ---

  // LẤY TẤT CẢ VÉ
  getAll: async (): Promise<TicketRes[]> => {
    const res = await api.get<ApiResponse<TicketRes[]>>(`/tickets`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // LẤY VÉ THEO TRẠNG THÁI
  getByStatus: async (status: TicketStatusType): Promise<TicketRes[]> => {
    const res = await api.get<ApiResponse<TicketRes[]>>(`/tickets/by-status`, {
      params: { status },
    });

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DUYỆT VÉ
  approveTicket: async (ticketId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(`/tickets/${ticketId}/approve`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // TỪ CHỐI VÉ
  rejectTicket: async (ticketId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(`/tickets/${ticketId}/reject`);

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