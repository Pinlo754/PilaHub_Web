export const REPORT_REASON = {
  COACH_NO_SHOW: "COACH_NO_SHOW",
  COACH_LATE: "COACH_LATE",
  POOR_TEACHING_QUALITY: "POOR_TEACHING_QUALITY",
  INAPPROPRIATE_BEHAVIOR: "INAPPROPRIATE_BEHAVIOR",
  SESSION_TECHNICAL_ISSUE: "SESSION_TECHNICAL_ISSUE",
  OTHER: "OTHER",
} as const;

export type ReportReasonType =
  (typeof REPORT_REASON)[keyof typeof REPORT_REASON];

export type LiveSessionReportType = {
  liveSessionId: string;
  reporterId: string; // The trainee who reported the issue
  reportedUserId: string; // The coach who is being reported
  reason: ReportReasonType;
  description: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  internalNote: string | null;
};

export type ResolveReportReq = Pick<LiveSessionReportType, "internalNote">;
