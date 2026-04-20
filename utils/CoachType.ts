import { GenderType } from "./TraineeType";

export type CoachType = {
  coachId: string;
  fullName: string;
  age: number;
  gender: GenderType;
  avatarUrl: string;
  bio: string;
  yearsOfExperience: number;
  specialization: string;
  certificationsUrl: string;
  avgRating: number;
  pricePerHour: number;
  active: boolean;
  createdAt: string;
};

export type FeedbackCoachType = {
  feedbackId: string;
  coachId: string;
  coachFullName: string;
  traineeId: string;
  traineeFullName: string;
  traineeAvatarUrl: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
