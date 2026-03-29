import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";
import {
  AddLessonExerciseReq,
  LessonExerciseType,
  UpdateLessonExerciseReq,
} from "@/utils/LessonExerciseType";

export const LessonExerciseService = {
  // ADD LESSON EXERCISE
  addLessonExercise: async (
    lessonId: string,
    payload: AddLessonExerciseReq[],
  ): Promise<LessonExerciseType> => {
    const res = await api.post<ApiResponse<LessonExerciseType>>(
      `/lesson-exercises/lesson/${lessonId}`,
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

  // UPDATE LESSON EXERCISE
  updateLessonExercise: async (
    lessonExerciseId: string,
    payload: UpdateLessonExerciseReq,
  ): Promise<LessonExerciseType> => {
    const res = await api.put<ApiResponse<LessonExerciseType>>(
      `/lesson-exercises/${lessonExerciseId}`,
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
