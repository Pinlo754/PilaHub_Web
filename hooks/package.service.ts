import { PaginationReq } from "@/utils/AccountType";
import api from "./AxiosInstance";
import {
  ApiResponse,
  mapPageResponse,
  PageResponse,
  PageResponseExtra,
} from "@/utils/ApiResType";
import {
  CreatePackageReq,
  PackageType,
  UpdatePackageReq,
} from "@/utils/PackageType";

export const PackageService = {
  // GET ALL
  getAll: async (
    payload?: PaginationReq,
  ): Promise<PageResponse<PackageType>> => {
    const res = await api.get<ApiResponse<PageResponseExtra<PackageType>>>(
      `/packages`,
      {
        params: payload,
      },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return mapPageResponse(res.data.data);
  },

  // CREATE PACKAGE
  createPackage: async (payload: CreatePackageReq): Promise<PackageType> => {
    const res = await api.post<ApiResponse<PackageType>>(`/packages`, payload);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE PACKAGE
  updatePackage: async (
    packageId: string,
    payload: UpdatePackageReq,
  ): Promise<PackageType> => {
    const res = await api.put<ApiResponse<PackageType>>(
      `/packages/${packageId}`,
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

  // DEACTIVE PACKAGE
  deactivePackage: async (packageId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/packages/${packageId}`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // ACTIVE PACKAGE
  activePackage: async (packageId: string): Promise<PackageType> => {
    const res = await api.patch<ApiResponse<PackageType>>(
      `/packages/${packageId}/activate`,
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
