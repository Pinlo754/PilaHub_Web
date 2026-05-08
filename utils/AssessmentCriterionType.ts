export type AssessmentCriterionType = {
  assessmentCriterionId: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssessmentCriterionReq = Pick<
  AssessmentCriterionType,
  "name" | "description" | "displayOrder"
>;

export type UpdateAssessmentCriterionReq = Pick<
  AssessmentCriterionType,
  "name" | "description" | "displayOrder" | "isActive"
>;
