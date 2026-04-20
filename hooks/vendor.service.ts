import { VendorType } from "@/utils/VendorType";
import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";

export interface Vendor {
  businessName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  logoUrl: string;
  businessLicenseUrl: string;
}

export const VendorService = {
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

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.get(`/vendors/${id}`);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async updateVendor(id: string, data: Vendor): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.put(`/vendors/${id}`, data);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async createVendor(data: Vendor): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.post(`/vendors`, data);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
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
