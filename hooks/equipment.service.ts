import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateEquipmentReq,
  EquipmentType,
  UpdateEquipmentReq,
} from "@/utils/EquipmentType";

export const EquipmentService = {
  // GET ALL
  getAll: async (): Promise<EquipmentType[]> => {
    const res = await api.get<ApiResponse<EquipmentType[]>>(`/equipment`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DELETE EQUIPMENT
  deleteEquipment: async (equipmentId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/equipment/${equipmentId}`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE EQUIPMENT
  createEquipment: async (
    payload: CreateEquipmentReq,
  ): Promise<EquipmentType> => {
    const res = await api.post<ApiResponse<EquipmentType>>(
      `/equipment`,
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

  // UPDATE EQUIPMENT
  updateEquipment: async (
    equipmentId: string,
    payload: UpdateEquipmentReq,
  ): Promise<EquipmentType> => {
    const res = await api.put<ApiResponse<EquipmentType>>(
      `/equipment/${equipmentId}`,
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
