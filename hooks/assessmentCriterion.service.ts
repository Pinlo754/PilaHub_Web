import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateAssessmentCriterionReq,
  AssessmentCriterionType,
  UpdateAssessmentCriterionReq,
} from "@/utils/AssessmentCriterionType";

export const AssessmentCriterionService = {
  // GET ALL
  getAll: async (): Promise<AssessmentCriterionType[]> => {
    const res =
      await api.get<ApiResponse<AssessmentCriterionType[]>>(
        `/assessment-criteria`,
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

  // SEARCH BY NAME
  searchByName: async (name: string): Promise<AssessmentCriterionType[]> => {
    const res = await api.get<ApiResponse<AssessmentCriterionType[]>>(
      `/assessment-criteria/search`,
      {
        params: {
          name,
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

  // CREATE ASSESSMENT CRITERION
  createAssessmentCriterion: async (
    payload: CreateAssessmentCriterionReq,
  ): Promise<AssessmentCriterionType> => {
    const res = await api.post<ApiResponse<AssessmentCriterionType>>(
      `/assessment-criteria`,
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

  // UPDATE ASSESSMENT CRITERION
  updateAssessmentCriterion: async (
    assessmentCriterionId: string,
    payload: UpdateAssessmentCriterionReq,
  ): Promise<AssessmentCriterionType> => {

    console.log('payload', payload);

    const res = await api.put<ApiResponse<AssessmentCriterionType>>(
      `/assessment-criteria/${assessmentCriterionId}`,
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

  // DEACTIVE ASSESSMENT CRITERION
  deactiveAssessmentCriterion: async (
    assessmentCriterionId: string,
  ): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/assessment-criteria/${assessmentCriterionId}/deactivate`,
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
