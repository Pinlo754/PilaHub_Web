import { ExerciseType } from "./ExerciseType";
import { LessonType } from "./LessonType";

export const LEVEL = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;

export type LevelType = (typeof LEVEL)[keyof typeof LEVEL];

export type CourseType = {
  courseId: string;
  name: string;
  description: string;
  imageUrl: string;
  level: LevelType;
  price: number;
  active: boolean;
  totalLesson: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseDetailType = {
  course: CourseType;
  lessons: CourseLessonDetailType[];
};

export type CourseLessonDetailType = {
  courseLessonId: string;
  displayOrder: number;
  notes: string | null;
  lesson: LessonType;
  exercises: LessonExerciseDetailType[];
};

export type LessonExerciseDetailType = {
  lessonExerciseId: string;
  displayOrder: number | null;
  sets: number | null;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
  exercise: ExerciseType;
};

export type CreateCourseReq = Pick<
  CourseType,
  "name" | "description" | "imageUrl" | "level" | "price"
>;

export type UpdateCourseReq = Pick<
  CourseType,
  "name" | "description" | "imageUrl" | "level" | "price"
>;
