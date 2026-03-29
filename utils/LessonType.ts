export type LessonType = {
  lessonId: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateLessonReq = Pick<LessonType, "name" | "description">;

export type UpdateLessonReq = Pick<LessonType, "name" | "description">;
