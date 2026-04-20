import { CoachType } from "./CoachType";
import { TraineeType } from "./TraineeType";

export const BOOKING_STATUS = {
  SCHEDULED: "SCHEDULED",
  CANCELLED_BY_COACH: "CANCELLED_BY_COACH",
  CANCELLED_BY_TRAINEE: "CANCELLED_BY_TRAINEE",
  READY: "READY",
  IN_PROGRESS: "IN_PROGRESS",
  NO_SHOW_BY_COACH: "NO_SHOW_BY_COACH",
  NO_SHOW_BY_TRAINEE: "NO_SHOW_BY_TRAINEE",
  COMPLETED: "COMPLETED",
  REFUNDED: "REFUNDED",
} as const;

export type BookingStatusType =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_TYPE = {
  SINGLE: "SINGLE",
  PERSONAL_TRAINING_PACKAGE: "PERSONAL_TRAINING_PACKAGE",
} as const;

export type BookingType = (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE];

export type PersonalScheduleType = {
  personalScheduleId: string;
  personalStageId: string;
  scheduleName: string;
  description: string;
  dayOfWeek: string;
  scheduledDate: string;
  durationMinutes: number;
  completed: boolean;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CoachBookingType = {
  id: string;
  coach: CoachType;
  trainee: TraineeType;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  totalAmount: number;
  status: BookingStatusType;
  bookingType: BookingType;
  recurringGroupId: string | null;
  createdAt: string;
  personalSchedule: PersonalScheduleType | null;
};
