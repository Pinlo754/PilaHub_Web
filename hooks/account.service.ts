import {
  AccountType,
  PaginationReq,
  UpdateAccountReq,
} from "@/utils/AccountType";
import api from "./AxiosInstance";
import { ApiResponse, PageResponse } from "@/utils/ApiResType";

export const AccountService = {
  // GET ALL
  getAll: async (
    payload?: PaginationReq,
  ): Promise<PageResponse<AccountType>> => {
    const res = await api.get<ApiResponse<PageResponse<AccountType>>>(
      `/accounts`,
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

    return res.data.data;
  },

  // UPDATE ACCOUNT
  updateAccount: async (
    accountId: string,
    payload: UpdateAccountReq,
  ): Promise<AccountType> => {
    const res = await api.put<ApiResponse<AccountType>>(
      `/accounts/${accountId}`,
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

  // DEACTIVE ACCOUNT
  deactiveAccount: async (accountId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/accounts/${accountId}`);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // ACTIVE ACCOUNT
  activeAccount: async (accountId: string): Promise<AccountType> => {
    const res = await api.patch<ApiResponse<AccountType>>(
      `/accounts/${accountId}/active`,
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
