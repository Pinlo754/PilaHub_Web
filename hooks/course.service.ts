import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import { CourseType, CreateCourseReq, UpdateCourseReq } from "@/utils/CourseType";

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
};
