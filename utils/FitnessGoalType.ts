export type FitnessGoalType = {
  goalId: string;
  code: string;
  vietnameseName: string;
};

export type PurposeType = {
  purposeId: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateFitnessGoalReq = {
  code: string;
  vietnameseName: string;
  description: string;
  relatedPurposeIds: string[];
};

export type UpdateFitnessGoalReq = Partial<CreateFitnessGoalReq>;
