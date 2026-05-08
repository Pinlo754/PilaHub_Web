export type SupplementType = {
  supplementId: string;
  name: string;
  description: string;
  brand: string;
  form: string;
  usageInstructions: string;
  benefits: string;
  sideEffects: string;
  contraindications: string;
  warnings: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplementReq = Omit<
  SupplementType,
  "supplementId" | "active" | "createdAt" | "updatedAt"
>;

export type UpdateSupplementReq = Partial<CreateSupplementReq>;
