import { LevelType } from "./CourseType";

export const EXERCISE_TYPE = {
  CORE_STRENGTHENING: "CORE_STRENGTHENING",
  PELVIC_FLOOR_ENGAGEMENT: "PELVIC_FLOOR_ENGAGEMENT",
  SPINAL_ARTICULATION: "SPINAL_ARTICULATION",
  SPINAL_FLEXION: "SPINAL_FLEXION",
  SPINAL_EXTENSION: "SPINAL_EXTENSION",
  SPINAL_ROTATION_TWIST: "SPINAL_ROTATION_TWIST",
  LATERAL_FLEXION: "LATERAL_FLEXION",
  HIP_WORK: "HIP_WORK",
  LEG_STRENGTHENING: "LEG_STRENGTHENING",
  SHOULDER_STABILIZATION: "SHOULDER_STABILIZATION",
  ARM_STRENGTHENING: "ARM_STRENGTHENING",
  BALANCE_STABILITY: "BALANCE_STABILITY",
  FLEXIBILITY_STRETCHING: "FLEXIBILITY_STRETCHING",
  BREATHING_RELAXATION: "BREATHING_RELAXATION",
  FULL_BODY_INTEGRATION: "FULL_BODY_INTEGRATION",
} as const;

export type ExerciseTypeEnum =
  (typeof EXERCISE_TYPE)[keyof typeof EXERCISE_TYPE];

export const BREATHING_RULE = {
  INHALE_ON_EFFORT: "INHALE_ON_EFFORT",
  EXHALE_ON_EFFORT: "EXHALE_ON_EFFORT",
  NASAL_BREATHING: "NASAL_BREATHING",
  MOUTH_BREATHING: "MOUTH_BREATHING",
  BOX_BREATHING: "BOX_BREATHING",
  DIAPHRAGMATIC: "DIAPHRAGMATIC",
  RHYTHMIC: "RHYTHMIC",
  HOLD_BREATH: "HOLD_BREATH",
  FREE_BREATHING: "FREE_BREATHING",
} as const;

export type BreathingRuleType =
  (typeof BREATHING_RULE)[keyof typeof BREATHING_RULE];

export type BodyPartType = {
  bodyPartId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseType = {
  exerciseId: string;
  name: string;
  imageUrl: string;
  description: string;
  exerciseType: ExerciseTypeEnum;
  difficultyLevel: LevelType;
  bodyParts: BodyPartType[] | null;
  equipmentRequired: boolean;
  benefits: string;
  prerequisites: string | null;
  contraindications: string | null;
  haveAIsupported: boolean;
  nameInModelAI: string | null;
  breathingRule: BreathingRuleType | null;
  active: boolean;
  duration: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateExerciseReq = {
  name: string;
  imageUrl: string;
  description: string;
  exerciseType: ExerciseTypeEnum;
  difficultyLevel: LevelType;
  bodyParts: string[];
  equipmentRequired: boolean;
  benefits: string;
  prerequisites: string | null;
  contraindications: string | null;
  haveAIsupported: boolean;
  nameInModelAI: string | null;
  breathingRule: BreathingRuleType | null;
  duration: number;
};

export type UpdateExerciseReq = Partial<CreateExerciseReq>;
