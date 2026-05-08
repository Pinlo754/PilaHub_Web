import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateTicketTypeReq,
  TicketStatusType,
  TicketType,
  UpdateTicketTypeReq,
} from "@/utils/TicketType";

export const TicketTypeService = {
  // GET ALL
  getAll: async (): Promise<TicketType[]> => {
    const res = await api.get<ApiResponse<TicketType[]>>(`/ticket-types`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE TICKET TYPE
  createTicketType: async (
    payload: CreateTicketTypeReq,
  ): Promise<TicketType> => {
    const res = await api.post<ApiResponse<TicketType>>(
      `/ticket-types`,
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

  // UPDATE TICKET TYPE
  updateTicketType: async (
    ticketTypeId: string,
    payload: UpdateTicketTypeReq,
  ): Promise<TicketType> => {
    const res = await api.put<ApiResponse<TicketType>>(
      `/ticket-types/${ticketTypeId}`,
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

  // DEACTIVE TICKET TYPE
  deactiveTicketType: async (ticketTypeId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/ticket-types/${ticketTypeId}/deactivate`,
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

  // ACTIVE TICKET TYPE
  activeTicketType: async (ticketTypeId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/ticket-types/${ticketTypeId}/activate`,
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
