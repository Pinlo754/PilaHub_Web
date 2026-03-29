// ================= ENUM TYPES =================
export const CATEGORY_TYPE = {
  SUPPLEMENT: "SUPPLEMENT",
  EQUIPMENT: "EQUIPMENT",
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export type RegionCode = "DN" | "HP" | "BD" | "HCM" | "HN";

// ================= MAIN TYPE =================
export type ProductType = {
  productId: string;
  vendorId: string;
  vendorBusinessName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  brand: string;
  specifications: string;
  categoryType: CategoryType | null;
  refId: string | null;
  height: number | null;
  length: number | null;
  width: number | null;
  weight: number | null;
  installationSupported: boolean;
  regionSupported: RegionCode[] | null;
  avgRating: number | null;
  reviewCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
