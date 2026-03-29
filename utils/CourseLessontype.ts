export type CourseLessonType = {
  courseLessonId: string;
  courseId: string;
  courseName: string;
  lessonId: string;
  lessonName: string;
  displayOrder: number;
  notes: string;
};

export type AddCourseLessonReq = Pick<
  CourseLessonType,
  "lessonId" | "displayOrder" | "notes"
>;

export type UpdateCourseLessonReq = Pick<
  CourseLessonType,
  "displayOrder" | "notes"
>;
