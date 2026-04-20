import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { BookingStatusType, CoachBookingType } from "@/utils/CoachBookingType";

export const CoachBookingService = {
  // GET ALL
  getAll: async (): Promise<CoachBookingType[]> => {
    const res =
      await api.get<ApiResponse<CoachBookingType[]>>(`/coach-bookings/all`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE STATUS
  updateStatus: async (
    coachBookingId: string,
    status: BookingStatusType,
  ): Promise<CoachBookingType> => {
    const res = await api.patch<ApiResponse<CoachBookingType>>(
      `/coach-bookings/${coachBookingId}/status`,
      null,
      {
        params: { status },
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
};
