import { ExerciseType } from "./ExerciseType";
import { CourseLessonDetailType } from "./CourseType";

export type StagedExercise = {
  id: string;
  exercise: ExerciseType;
  displayOrder: number | null;
  sets: number | null;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
  optional: boolean;
};

export type StagedLesson = {
  id: string;
  name: string; // thêm field name
  displayOrder: number;
  notes: string;
  exercises: StagedExercise[];
};

export type ExerciseFormData = {
  sets: string;
  reps: string;
  durationSeconds: string;
  restSeconds: string;
  exerciseNotes: string;
  optional: boolean;
};

export const DEFAULT_EXERCISE_FORM: ExerciseFormData = {
  sets: "3",
  reps: "12",
  durationSeconds: "60",
  restSeconds: "30",
  exerciseNotes: "",
  optional: false,
};

// Convert CourseLessonDetailType[] → StagedLesson[] khi load edit
export const toStagedLessons = (
  lessons: CourseLessonDetailType[],
): StagedLesson[] =>
  lessons.map((l) => ({
    id: l.courseLessonId,
    name: l.lesson.name, // lấy name từ lesson thực
    displayOrder: l.displayOrder,
    notes: l.notes ?? "",
    exercises: l.exercises.map((ex) => ({
      id: ex.lessonExerciseId,
      exercise: ex.exercise,
      displayOrder: ex.displayOrder ?? null,
      sets: ex.sets ?? null,
      reps: ex.reps ?? null,
      durationSeconds: ex.durationSeconds ?? null,
      restSeconds: ex.restSeconds ?? null,
      notes: ex.notes ?? null,
      optional: false,
    })),
  }));
