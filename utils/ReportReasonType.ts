export type ReportReasonType = {
  reportReasonId: string;
  name: string;
  code: "COACH_NO_SHOW";
  description: string;
  requiresDescription: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportReasonReq = Pick<
  ReportReasonType,
  "name" | "code" | "description" | "requiresDescription"
>;

export type UpdateReportReasonReq = Pick<
  ReportReasonType,
  "name" | "code" | "description" | "requiresDescription" | "active"
>;
