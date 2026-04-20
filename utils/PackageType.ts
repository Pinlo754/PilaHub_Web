import { PackageType as PackageTypeEnum } from "./AccountType";

export type PackageType = {
  packageId: string;
  packageName: string;
  description: string;
  price: number;
  durationInDays: number;
  packageType: PackageTypeEnum;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePackageReq = Omit<
  PackageType,
  "packageId" | "createdAt" | "updatedAt"
>;

export type UpdatePackageReq = Partial<CreatePackageReq>;
