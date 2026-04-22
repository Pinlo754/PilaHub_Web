import { ApiResponse, PageResponse } from "@/utils/ApiResType";
import api from "./AxiosInstance";
import { ProductType } from "@/utils/ProductType";

type Product = {
  productId: string;
  categoryId: string;
  refId?: string; // 👈 thêm
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  brand: string;
  specifications: string;
  height: number;
  length: number;
  width: number;
  weight: number;
  installationSupported: boolean;
  regionSupported: string[];
};

export const ProductService = {
  async getMyProduct(id: string, pageable: any): Promise<ApiResponse<any>> {
    try {
      //const res = await api.get(`/products/vendor/${id}`);
      const res = await api.get(`/products?vendorId=${id}`);
      console.log(res.data);
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

  async getProductById(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/products/${id}`);

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

  async updateProduct(id: string, payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.put(`/products/${id}`, payload);

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

  async createProduct(payload: any): Promise<ApiResponse<any>> {
    try {
      const res = await api.post(`/products`, payload);

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

  async getAllCategory(): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/categories`);

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

  async getAllRef(): Promise<ApiResponse<any>> {
    try {
      const res = await api.get(`/categories`);

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

  // GET BY VENDOR_ID
  getByVendorId: async (
    vendorId: string,
    page: number,
    size: number,
  ): Promise<PageResponse<ProductType>> => {
    // const pageable = {
    //   page,
    //   size,
    // };

    const res = await api.get<ApiResponse<PageResponse<ProductType>>>(
      `/products`,
      {
        params: {
          vendorId,
          page,
          size,
        },
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
