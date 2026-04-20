import { CategoryType as CategoryTypeEnum } from "./ProductType";

export type CategoryType = {
  categoryId: string;
  parentCategoryId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  categoryType: CategoryTypeEnum | null;
  active: true;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryReq = Omit<
  CategoryType,
  "categoryId" | "active" | "createdAt" | "updatedAt"
>;

export type UpdateCategoryReq = Partial<CreateCategoryReq>;
