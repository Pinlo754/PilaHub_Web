import { CoachBookingType } from "./CoachBookingType";

export const LIVE_SESSION_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  NO_SHOW: "NO_SHOW",
  FAILED: "FAILED",
} as const;

export type LiveSessionStatusType =
  (typeof LIVE_SESSION_STATUS)[keyof typeof LIVE_SESSION_STATUS];

export type LiveSessionType = {
  liveSessionId: string;
  coachBooking: CoachBookingType;
  channelName: string;
  coachUid: number;
  traineeUid: number;
  coachToken: string | null;
  traineeToken: string | null;
  tokenGeneratedAt: string | null;
  tokenExpiresAt: string | null;
  status: LiveSessionStatusType;
  coachJoinedAt: string | null;
  traineeJoinedAt: string | null;
  sessionEndedAt: string;
  recordingEnabled: boolean;
  agoraResourceId: string | null;
  agoraRecordingSid: string | null;
  recordingUrl: string | null;
  recordingExpiresAt: string;
  ratingByTrainee: number | null;
  commentByCoach: string | null;
  errorMessage: string | null;
  createdAt: string;
};
