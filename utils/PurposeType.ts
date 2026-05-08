export type PurposeType = {
  purposeId: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePurposeReq = Pick<
  PurposeType,
  "name" | "code" | "description"
>;

export type UpdatePurposeReq = Partial<CreatePurposeReq>;
