export const ROLE = {
  Admin: "ADMIN",
  Coach: "COACH",
  Vendor: "VENDOR",
  Trainee: "TRAINEE",
} as const;

export type RoleType = (typeof ROLE)[keyof typeof ROLE];

export const PACKAGE = {
  Member: "MEMBER",
  VipMember: "VIP_MEMBER",
} as const;

export type PackageType = (typeof PACKAGE)[keyof typeof PACKAGE];

export type AccountType = {
  accountId: string;
  email: string;
  phoneNumber: string;
  role: RoleType;
  active: boolean;
  emailVerified: boolean;
  lastSeenAt: string;
  fcmToken: string;
  isReminded: boolean;
  createdAt: string;
  activePackageType: PackageType | null;
};

export type PaginationReq = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type UpdateAccountReq = {
  email: string;
  phoneNumber: string;
  role: RoleType;
  active: boolean;
  emailVerified?: boolean;
};

export type CreateAccountReq = {
  email: string;
  phoneNumber: string;
  password: string;
};
