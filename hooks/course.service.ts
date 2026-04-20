import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CourseDetailType,
  CourseType,
  CreateCourseReq,
  UpdateCourseReq,
} from "@/utils/CourseType";

export const CourseService = {
  // GET ALL
  getAll: async (): Promise<CourseType[]> => {
    const res = await api.get<ApiResponse<CourseType[]>>(`/courses`);

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
  getById: async (courseId: string): Promise<CourseDetailType> => {
    const res = await api.get<ApiResponse<CourseDetailType>>(
      `/courses/${courseId}/details`,
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

  // GET BY DIFFICULTY LEVEL
  getByLevel: async (level: string): Promise<CourseType[]> => {
    const res = await api.get<ApiResponse<CourseType[]>>(
      `/courses/level/${level}`,
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
  searchByName: async (name: string): Promise<CourseType[]> => {
    const res = await api.get<ApiResponse<CourseType[]>>(`/courses/search`, {
      params: {
        name,
      },
    });

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CREATE COURSE
  createCourse: async (payload: CreateCourseReq): Promise<CourseType> => {
    const res = await api.post<ApiResponse<CourseType>>(`/courses`, payload);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE COURSE
  updateCourse: async (
    courseId: string,
    payload: UpdateCourseReq,
  ): Promise<CourseType> => {
    const res = await api.put<ApiResponse<CourseType>>(
      `/courses/${courseId}`,
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

  // DEACTIVE COURSE
  deactiveCourse: async (courseId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/courses/${courseId}/deactivate`,
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

  // ACTIVE COURSE
  activeCourse: async (courseId: string): Promise<any> => {
    const res = await api.patch<ApiResponse<any>>(
      `/courses/${courseId}/activate`,
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

  // DELETE COURSE
  deleteCourse: async (courseId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/courses/${courseId}`);

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
