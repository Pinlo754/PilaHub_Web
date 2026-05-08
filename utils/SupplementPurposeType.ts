import { PurposeType } from "./PurposeType";

export type SupplementPurposeType = {
  supplementPurposeId: string;
  supplementId: string;
  purpose: PurposeType;
  primary: boolean;
  effectivenessNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplementPurposeReq = {
  supplementId: string;
  purposeId: string;
  primary: boolean;
  effectivenessNotes: string;
};

export type UpdateSupplementPurposeReq = Pick<
  CreateSupplementPurposeReq,
  "primary" | "effectivenessNotes"
>;
