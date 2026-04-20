// CONSTANT
export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type GenderType = (typeof GENDER)[keyof typeof GENDER];

export const WORKOUT_LEVEL = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export type WorkoutLevelType =
  (typeof WORKOUT_LEVEL)[keyof typeof WORKOUT_LEVEL];

export const WORKOUT_FREQUENCY = {
  SEDENTARY: "SEDENTARY",
  LIGHT: "LIGHT",
  MODERATE: "MODERATE",
  ACTIVE: "ACTIVE",
  ATHLETE: "ATHLETE",
} as const;

export type WorkoutFrequencyType =
  (typeof WORKOUT_FREQUENCY)[keyof typeof WORKOUT_FREQUENCY];

// TYPE
export type TraineeType = {
  traineeId: string;
  fullName: string;
  age: number;
  gender: GenderType;
  avatarUrl: string;
  workoutLevel: WorkoutLevelType;
  workoutFrequency: WorkoutFrequencyType;
  createdAt: string;
};
