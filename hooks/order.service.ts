import { ApiResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";
import { OrderStatusType, OrderType } from "@/utils/OrderType";

export const OrderService = {
  async getMyOrders(id: string): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/orders/vendor/my-orders`);
      console.log("Orders:");
      console.log(res.data.data);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  

  async getAllOrders(): Promise<ApiResponse<any[]>> {
    try {
      const res = await api.get(`/orders`);
      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/orders/${id}`);

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async approveOrder(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.put(`/orders/${id}/status?status=CONFIRMED`);

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async updateStatus(id: string, status: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.put(`/orders/${id}/status?status=${status}`);

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async createShipment(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/shipments/order/${id}/create`);

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  // GET ALL
  getAll: async (): Promise<OrderType[]> => {
    const res = await api.get<ApiResponse<OrderType[]>>(`/orders`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET BY VENDOR_ID
  getByVendorId: async (vendorId: string): Promise<OrderType[]> => {
    const res = await api.get<ApiResponse<OrderType[]>>(
      `/orders/admin/vendors/${vendorId}/orders`,
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

  // PAYOUT FOR VENDOR
  payoutForVendor: async (orderId: string): Promise<string> => {
    const res = await api.post<ApiResponse<string>>(
      `/orders/${orderId}/vendor-payout`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.message;
  },

  async updateShipment(id: string, status: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.put(`/shipments/${id}/status`, null, {
        params: {
          id: id,
          status: status,
        },
      });

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },


  async createShipmentProvider(id: string, payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/shipments/${id}/create`, payload);

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async getMyReturn(): Promise<ApiResponse<any>> {
    try {
      const res = await api.get('/order-returns/vendor/my-returns');

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async approveReturn(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.patch(`/order-returns/${id}/approve`);

      return res.data;

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async rejectReturn(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.patch(`/order-returns/${id}/reject`);

      return res.data;

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },

  async completeReturn(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.patch(`/order-returns/${id}/complete`);

      return res.data;

      return res.data;
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || "Unknown error",
        data: [],
        errorCode: e.response?.data?.errorCode ?? null,
        timestamp: Date.now(),
      };
    }
  },


  // UPDATE ORDER STATUS
  updateOrderStatus: async (
    orderId: string,
    status: OrderStatusType,
  ): Promise<OrderType> => {
    const res = await api.put<ApiResponse<OrderType>>(
      `/orders/${orderId}/status`,
      {
        status,
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
