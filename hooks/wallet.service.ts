import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";

export const WalletService = {
  async getMyWallet(): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/wallet/my-wallet`);
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

  async createWallet(): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/wallet`);
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

  async deposit(payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/wallet/deposit/create`, payload);
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

  async withdrawal(payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/wallet-withdrawals`, payload);
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

  async getAllRequest(): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/wallet-withdrawals`);
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

  async getRequestById(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/wallet-withdrawals/${id}`);
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

  async completeWithdrawal(id: string): Promise<ApiResponse<any>> {
    try {
      await api.patch(`/wallet-withdrawals/${id}/approve`);
      const res = await api.patch(`/wallet-withdrawals/${id}/complete`);
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

  async rejectWithdrawal(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.patch(`/wallet-withdrawals/${id}/reject`);
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
