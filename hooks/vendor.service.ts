import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

export interface Vendor {
  businessName: string
  phoneNumber: string
  address: string
  city: string
  country: string
  logoUrl: string
  businessLicenseUrl: string
}

export const VendorService = {
  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.get(`/vendors/${id}`)
      return res.data
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      }
    }
  },

  async updateVendor(id: string, data: Vendor): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.put(`/vendors/${id}`, data)
      return res.data
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      }
    }
  },

  async createVendor(data: Vendor): Promise<ApiResponse<Vendor>> {
    try {
      const res = await api.post(`/vendors`, data)
      return res.data
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: {} as Vendor,
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      }
    }
  },


}