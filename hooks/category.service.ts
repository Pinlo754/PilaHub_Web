import {
  CategoryType,
  CreateCategoryReq,
  UpdateCategoryReq,
} from "@/utils/CategoryType";
import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";

export const CategoryService = {
  // GET ALL
  getAll: async (): Promise<CategoryType[]> => {
    const res = await api.get<ApiResponse<CategoryType[]>>(`/categories`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // GET SUBCATEGORY
  getSubcategory: async (categoryId: string): Promise<CategoryType[]> => {
    const res = await api.get<ApiResponse<CategoryType[]>>(
      `/categories/${categoryId}/subcategories`,
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

  // CREATE CATEGORY
  createCategory: async (payload: CreateCategoryReq): Promise<CategoryType> => {
    const res = await api.post<ApiResponse<CategoryType>>(
      `/categories`,
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

  // UPDATE CATEGORY
  updateCategory: async (
    categoryId: string,
    payload: UpdateCategoryReq,
  ): Promise<CategoryType> => {
    const res = await api.put<ApiResponse<CategoryType>>(
      `/categories/${categoryId}`,
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

  // DEACTIVE CATEGORY
  deactiveCategory: async (categoryId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/categories/${categoryId}/deactivate`,
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

  // ACTIVE CATEGORY
  activeCategory: async (categoryId: string): Promise<CategoryType> => {
    const res = await api.patch<ApiResponse<CategoryType>>(
      `/categories/${categoryId}/activate`,
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

  // DELETE CATEGORY
  deleteCategory: async (categoryId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/categories/${categoryId}`);

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
