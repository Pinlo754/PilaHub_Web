export type LessonExerciseType = {
  lessonExerciseId: string;
  lessonId: string;
  lessonName: string;
  exerciseId: string;
  exerciseName: string;
  displayOrder: number | null;
  sets: number | null;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
};

export type AddLessonExerciseReq = {
  exerciseId: string;
  displayOrder: number;
  sets: number;
  reps: number;
  durationSeconds: number;
  restSeconds: number;
  notes: string;
  optional: boolean;
};

export type UpdateLessonExerciseReq = Omit<AddLessonExerciseReq, "exerciseId">;
