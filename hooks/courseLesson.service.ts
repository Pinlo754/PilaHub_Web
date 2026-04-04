import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  AddCourseLessonReq,
  CourseLessonType,
  UpdateCourseLessonReq,
} from "@/utils/CourseLessontype";

export const CourseLessonService = {
  // ADD COURSE LESSON
  addCourseLesson: async (
    courseId: string,
    payload: AddCourseLessonReq[],
  ): Promise<CourseLessonType> => {
    const res = await api.post<ApiResponse<CourseLessonType>>(
      `/course-lessons/course/${courseId}`,
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

  // UPDATE COURSE LESSON
  updateCourseLesson: async (
    courseLessonId: string,
    payload: UpdateCourseLessonReq,
  ): Promise<CourseLessonType> => {
    const res = await api.put<ApiResponse<CourseLessonType>>(
      `/course-lessons/${courseLessonId}`,
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
