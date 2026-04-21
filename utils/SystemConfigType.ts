export const SYSTEM_KEY = {
  PLATFORM_FEE_PERCENTAGE: "PLATFORM_FEE_PERCENTAGE",
  HOLDING_DAYS: "HOLDING_DAYS",
  HOURS_PER_SLOT: "HOURS_PER_SLOT",
  EMAIL_ADMIN: "EMAIL_ADMIN",
  VENDOR_CONFIRM_ORDER_HOURS: "VENDOR_CONFIRM_ORDER_HOURS",
} as const;

export type SystemKeyType = (typeof SYSTEM_KEY)[keyof typeof SYSTEM_KEY];

export type SystemConfigType = {
  configId: string;
  key: SystemKeyType;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSystemConfigReq = Pick<
  SystemConfigType,
  "key" | "value" | "description"
>;
