import { RoleType } from "./AccountType";
import { LEVEL, LevelType } from "./CourseType";
import {
  OrderDetailStatusType,
  OrderStatusType,
  ShipmentStatusType,
} from "./OrderType";
import { CategoryType, RegionCode } from "./ProductType";

// TYPE
type MapType = {
  bgColor: string;
  textColor: string;
  label: string;
};

// CONSTANT
export const ACCOUNT_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type AccountStatusType =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

// MAP
export const ACCOUNT_STATUS_MAP: Record<AccountStatusType, MapType> = {
  UNVERIFIED: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    label: "Chưa xác thực",
  },
  ACTIVE: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Đang hoạt động",
  },
  INACTIVE: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    label: "Tạm dừng",
  },
} as const;

export const ACCOUNT_ROLE_MAP: Record<RoleType, { label: string }> = {
  ADMIN: {
    label: "Quản trị viên",
  },
  COACH: {
    label: "HLV",
  },
  VENDOR: {
    label: "Nhà cung cấp",
  },
  TRAINEE: {
    label: "Học viên",
  },
};

export const LEVEL_MAP: Record<LevelType, MapType> = {
  BEGINNER: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    label: "Cơ bản",
  },
  INTERMEDIATE: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    label: "Trung cấp",
  },
  ADVANCED: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    label: "Nâng cao",
  },
} as const;

export const DIFFICULTY_LEVELS: LevelType[] = [
  LEVEL.Beginner,
  LEVEL.Intermediate,
  LEVEL.Advanced,
];

export const ORDER_STATUS_MAP: Record<OrderStatusType, MapType> = {
  PENDING: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    label: "Chờ xác nhận",
  },
  CONFIRMED: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    label: "Đã xác nhận",
  },
  READY: {
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    label: "Sẵn sàng giao",
  },
  SHIPPED: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    label: "Đang giao",
  },
  DELIVERED: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Đã giao",
  },
  FAILED_DELIVERY: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    label: "Giao thất bại",
  },
  COMPLETED: {
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    label: "Hoàn tất",
  },
  CANCELLED: {
    bgColor: "bg-gray-200",
    textColor: "text-gray-700",
    label: "Đã hủy",
  },
  RETURNED: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    label: "Đã trả hàng",
  },
  REFUNDED: {
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
    label: "Đã hoàn tiền",
  },
};

export const ORDER_DETAIL_STATUS_MAP: Record<OrderDetailStatusType, MapType> = {
  ...ORDER_STATUS_MAP,
  OUT_OF_STOCK: {
    bgColor: "bg-red-200",
    textColor: "text-red-800",
    label: "Hết hàng",
  },
};

export const SHIPMENT_STATUS_MAP: Record<ShipmentStatusType, MapType> = {
  DRAFT: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    label: "Nháp",
  },
  READY_TO_PICK: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    label: "Chờ lấy hàng",
  },
  PICKING: {
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    label: "Đang lấy hàng",
  },
  PICKED: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    label: "Đã lấy",
  },
  STORING: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    label: "Đang lưu kho",
  },
  TRANSPORTING: {
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    label: "Đang vận chuyển",
  },
  DELIVERING: {
    bgColor: "bg-blue-200",
    textColor: "text-blue-800",
    label: "Đang giao",
  },
  DELIVERED: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Đã giao",
  },
  DELIVERY_FAIL: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    label: "Giao thất bại",
  },
  RETURN: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    label: "Bắt đầu hoàn",
  },
  RETURNING: {
    bgColor: "bg-orange-200",
    textColor: "text-orange-800",
    label: "Đang hoàn",
  },
  RETURNED: {
    bgColor: "bg-orange-300",
    textColor: "text-orange-900",
    label: "Đã hoàn",
  },
  CANCELLED: {
    bgColor: "bg-gray-200",
    textColor: "text-gray-700",
    label: "Đã hủy",
  },
};

export const CATEGORY_TYPE_LABEL: Record<CategoryType, string> = {
  SUPPLEMENT: "Thực phẩm bổ sung",
  EQUIPMENT: "Thiết bị",
};

export const REGION_LABEL: Record<RegionCode, string> = {
  DN: "Đà Nẵng",
  HP: "Hải Phòng",
  BD: "Bình Dương",
  HCM: "Hồ Chí Minh",
  HN: "Hà Nội",
};

// FUNCTION
export const getAccountStatus = (emailVerified: boolean, active: boolean) => {
  if (!emailVerified) return "UNVERIFIED";
  return active ? "ACTIVE" : "INACTIVE";
};

export const getVerifyConfig = (verified: boolean) =>
  verified
    ? {
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        label: "Đã xác thực",
      }
    : {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        label: "Chưa xác thực",
      };

export const getActiveConfig = (active: boolean) =>
  active
    ? {
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        label: "Đã kích hoạt",
      }
    : {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        label: "Chưa kích hoạt",
      };

export const getLevelConfig = (level: LevelType) => {
  return LEVEL_MAP[level];
};

export const getLevelLabel = (level: LevelType): string => {
  return LEVEL_MAP[level].label;
};

export const getOrderStatusConfig = (status: OrderStatusType) =>
  ORDER_STATUS_MAP[status];

export const getOrderStatusLabel = (status: OrderStatusType) =>
  ORDER_STATUS_MAP[status].label;

export const getShipmentStatusConfig = (status: ShipmentStatusType) =>
  SHIPMENT_STATUS_MAP[status];

export const getOrderDetailStatusConfig = (status: OrderDetailStatusType) =>
  ORDER_DETAIL_STATUS_MAP[status];

export const getCategoryTypeLabel = (type: string | null | undefined) => {
  if (!type) return "Không xác định";
  return CATEGORY_TYPE_LABEL[type as keyof typeof CATEGORY_TYPE_LABEL] || type;
};

export const getRegionLabels = (regions?: string[] | null) => {
  if (!regions || regions.length === 0) return ["Toàn quốc"];

  return regions.map((r) => REGION_LABEL[r as keyof typeof REGION_LABEL] || r);
};
