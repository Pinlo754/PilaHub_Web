export type ReturnReasonType = {
  reasonId: string;
  code: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateReturnReasonReq = Pick<
  ReturnReasonType,
  "code" | "description" | "enabled"
>;

export type UpdateReturnReasonReq = Partial<CreateReturnReasonReq>;
