import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { TicketStatusType, TicketRes } from "@/utils/TicketType";

export const TicketService = {
  // GET ALL
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

  // GET BY STATUS
  getByStatus: async (status: TicketStatusType): Promise<TicketRes[]> => {
    const res = await api.get<ApiResponse<TicketRes[]>>(`/tickets/by-status`, {
      params: {
        status,
      },
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

  // APPROVE TICKET
  approveTicket: async (ticketId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/tickets/${ticketId}/approve`,
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

  // REJECT TICKET
  rejectTicket: async (ticketId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/tickets/${ticketId}/reject`,
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
