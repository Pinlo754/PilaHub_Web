import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  SystemConfigType,
  UpdateSystemConfigReq,
} from "@/utils/SystemConfigType";

export const SystemConfigService = {
  // GET ALL
  getAll: async (): Promise<SystemConfigType[]> => {
    const res =
      await api.get<ApiResponse<SystemConfigType[]>>(`/system-configs`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE SYSTEM CONFIG
  updateSystemConfig: async (
    configId: string,
    payload: UpdateSystemConfigReq,
  ): Promise<SystemConfigType> => {
    const res = await api.put<ApiResponse<SystemConfigType>>(
      `/system-configs/${configId}`,
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
