import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  CreateLessonReq,
  LessonType,
  UpdateLessonReq,
} from "@/utils/LessonType";

export const LessonService = {
  // CREATE LESSON
  createLesson: async (payload: CreateLessonReq): Promise<LessonType> => {
    const res = await api.post<ApiResponse<LessonType>>(`/lessons`, payload);

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPDATE LESSON
  updateLesson: async (
    lessonId: string,
    payload: UpdateLessonReq,
  ): Promise<LessonType> => {
    const res = await api.put<ApiResponse<LessonType>>(
      `/lessons/${lessonId}`,
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

  // DELETE LESSON
  deleteLesson: async (lessonId: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(`/lessons/${lessonId}`);

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
