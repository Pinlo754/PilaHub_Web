import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { VendorType } from "@/utils/VendorType";

export const VendorService = {
  // GET ALL
  getAll: async (): Promise<VendorType[]> => {
    const res = await api.get<ApiResponse<VendorType[]>>(`/vendors`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET BY ID
  getById: async (vendorId: string): Promise<VendorType> => {
    const res = await api.get<ApiResponse<VendorType>>(`/vendors/${vendorId}`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // VERIFY VENDOR
  verifyVendor: async (vendorId: string): Promise<VendorType> => {
    const res = await api.patch<ApiResponse<VendorType>>(
      `/vendors/${vendorId}/verify`,
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
