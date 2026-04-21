import { PackageType, RoleType } from "./AccountType";
import { BookingStatusType, BookingType } from "./CoachBookingType";
import { LEVEL, LevelType } from "./CourseType";
import {
  BREATHING_RULE,
  BreathingRuleType,
  EXERCISE_TYPE,
  ExerciseTypeEnum,
} from "./ExerciseType";
import {
  IngredientWithRulesType,
  RULE_ACTION,
  RULE_OPERATOR,
  RULE_SEVERITY,
  RULE_TYPE,
  RuleActionType,
  RuleOperatorType,
  RuleSeverityType,
  RuleTypeEnum,
  UpdateIngredientReq,
} from "./IngredientType";
import { REPORT_REASON, ReportReasonType } from "./LiveSessionReportType";
import { LiveSessionStatusType } from "./LiveSessionType";
import {
  OrderDetailStatusType,
  OrderStatusType,
  ShipmentStatusType,
} from "./OrderType";
import { CategoryType, RegionCode } from "./ProductType";
import { SystemKeyType } from "./SystemConfigType";
import {
  GenderType,
  WorkoutFrequencyType,
  WorkoutLevelType,
} from "./TraineeType";
import { TransactionFlowType, TransactionTypeEnum } from "./TransactionType";

// TYPE
type MapType = {
  bgColor: string;
  textColor: string;
  label: string;
};

export type TransactionCategoryType =
  | "ALL"
  | "WALLET"
  | "ORDER"
  | "BOOKING"
  | "PACKAGE"
  | "COURSE"
  | "FEES"
  | "VENDOR"
  | "OTHER";

type Option<T> = {
  value: T;
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

export const CATEGORY_TYPE_MAP: Record<CategoryType, MapType> = {
  SUPPLEMENT: {
    label: "Thực phẩm bổ sung",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  EQUIPMENT: {
    label: "Thiết bị",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
};

export const REGION_LABEL: Record<RegionCode, string> = {
  DN: "Đà Nẵng",
  HP: "Hải Phòng",
  BD: "Bình Dương",
  HCM: "Hồ Chí Minh",
  HN: "Hà Nội",
};

export const TRANSACTION_TYPE_MAP: Record<TransactionTypeEnum, MapType> = {
  WALLET_TOP_UP: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    label: "Nạp tiền",
  },
  WALLET_WITHDRAWAL: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    label: "Rút tiền",
  },
  SUBSCRIPTION_PACKAGE: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    label: "Mua gói",
  },
  SUBSCRIPTION_PRORATION_REFUND: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    label: "Hoàn tiền gói",
  },
  SUBSCRIPTION_UPGRADE: {
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    label: "Nâng cấp gói",
  },
  REFUND: {
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
    label: "Hoàn tiền",
  },
  PENALTY: {
    bgColor: "bg-red-200",
    textColor: "text-red-800",
    label: "Phạt",
  },
  BOOKING_COACH: {
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    label: "Đặt HLV",
  },
  BOOKING_COACH_REFUND: {
    bgColor: "bg-cyan-200",
    textColor: "text-cyan-800",
    label: "Hoàn tiền HLV",
  },
  ORDER: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    label: "Thanh toán đơn hàng",
  },
  VENDOR_PAYOUT: {
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    label: "Thanh toán NCC",
  },
  PLATFORM_FEE: {
    bgColor: "bg-gray-200",
    textColor: "text-gray-700",
    label: "Phí nền tảng",
  },
  SHIPPING_FEE_THIRD_PARTY: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    label: "Phí vận chuyển (3rd)",
  },
  SHIPPING_FEE_VENDOR: {
    bgColor: "bg-orange-200",
    textColor: "text-orange-800",
    label: "Phí vận chuyển (NCC)",
  },
  VENDOR_EARNING: {
    bgColor: "bg-green-200",
    textColor: "text-green-800",
    label: "Doanh thu NCC",
  },
  COURSE: {
    bgColor: "bg-blue-200",
    textColor: "text-blue-800",
    label: "Khóa học",
  },
};

export const TRANSACTION_FLOW_MAP: Record<
  TransactionTypeEnum,
  TransactionFlowType
> = {
  // Ví
  WALLET_TOP_UP: "INCOME",
  WALLET_WITHDRAWAL: "EXPENSE",

  // Subscription
  SUBSCRIPTION_PACKAGE: "INCOME",
  SUBSCRIPTION_PRORATION_REFUND: "EXPENSE",
  SUBSCRIPTION_UPGRADE: "INCOME",

  // Misc
  REFUND: "EXPENSE",
  PENALTY: "INCOME",

  // Coach
  BOOKING_COACH: "INCOME",
  BOOKING_COACH_REFUND: "EXPENSE",

  // Order
  ORDER: "INCOME",

  // Vendor
  VENDOR_PAYOUT: "EXPENSE",
  VENDOR_EARNING: "NORMAL",

  // Phí
  PLATFORM_FEE: "NORMAL",
  SHIPPING_FEE_THIRD_PARTY: "NORMAL",
  SHIPPING_FEE_VENDOR: "NORMAL",

  // Course
  COURSE: "INCOME",
};

export const TRANSACTION_FLOW_CONFIG: Record<
  TransactionFlowType,
  { bgColor: string; textColor: string; sign: string }
> = {
  INCOME: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    sign: "+",
  },
  EXPENSE: {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    sign: "-",
  },
  NORMAL: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    sign: "",
  },
};

export const EXERCISE_TYPE_MAP: Record<ExerciseTypeEnum, MapType> = {
  CORE_STRENGTHENING: {
    label: "Tăng cường core",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  PELVIC_FLOOR_ENGAGEMENT: {
    label: "Sàn chậu",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  SPINAL_ARTICULATION: {
    label: "Cột sống linh hoạt",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  SPINAL_FLEXION: {
    label: "Gập cột sống",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  SPINAL_EXTENSION: {
    label: "Duỗi cột sống",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
  },
  SPINAL_ROTATION_TWIST: {
    label: "Xoay cột sống",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  LATERAL_FLEXION: {
    label: "Nghiêng người",
    bgColor: "bg-teal-100",
    textColor: "text-teal-700",
  },
  HIP_WORK: {
    label: "Hông",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  LEG_STRENGTHENING: {
    label: "Chân",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  SHOULDER_STABILIZATION: {
    label: "Ổn định vai",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  ARM_STRENGTHENING: {
    label: "Tay",
    bgColor: "bg-lime-100",
    textColor: "text-lime-700",
  },
  BALANCE_STABILITY: {
    label: "Thăng bằng",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  FLEXIBILITY_STRETCHING: {
    label: "Giãn cơ",
    bgColor: "bg-rose-100",
    textColor: "text-rose-700",
  },
  BREATHING_RELAXATION: {
    label: "Thở & thư giãn",
    bgColor: "bg-sky-100",
    textColor: "text-sky-700",
  },
  FULL_BODY_INTEGRATION: {
    label: "Toàn thân",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
};

export const BREATHING_RULE_MAP: Record<BreathingRuleType, MapType> = {
  INHALE_ON_EFFORT: {
    label: "Hít khi gắng sức",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  EXHALE_ON_EFFORT: {
    label: "Thở ra khi gắng sức",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  NASAL_BREATHING: {
    label: "Thở bằng mũi",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
  },
  MOUTH_BREATHING: {
    label: "Thở bằng miệng",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  BOX_BREATHING: {
    label: "Box breathing",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  DIAPHRAGMATIC: {
    label: "Thở bụng",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  RHYTHMIC: {
    label: "Thở theo nhịp",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  HOLD_BREATH: {
    label: "Nín thở",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  FREE_BREATHING: {
    label: "Thở tự do",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
};

export const GENDER_MAP: Record<GenderType, MapType> = {
  MALE: {
    label: "Nam",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  FEMALE: {
    label: "Nữ",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  OTHER: {
    label: "Khác",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

export const WORKOUT_LEVEL_MAP: Record<WorkoutLevelType, MapType> = {
  BEGINNER: {
    label: "Mới bắt đầu",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  INTERMEDIATE: {
    label: "Trung cấp",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  ADVANCED: {
    label: "Nâng cao",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
};

export const WORKOUT_FREQUENCY_MAP: Record<WorkoutFrequencyType, MapType> = {
  SEDENTARY: {
    label: "Ít vận động (0 buổi/tuần)",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  LIGHT: {
    label: "Nhẹ (1–2 buổi/tuần)",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  MODERATE: {
    label: "Trung bình (3–4 buổi/tuần)",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  ACTIVE: {
    label: "Năng động (5–6 buổi/tuần)",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  ATHLETE: {
    label: "Vận động viên (7+ buổi/tuần)",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
};

export const REPORT_REASON_MAP: Record<ReportReasonType, MapType> = {
  COACH_NO_SHOW: {
    label: "HLV không tham gia",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  COACH_LATE: {
    label: "HLV vào muộn",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  POOR_TEACHING_QUALITY: {
    label: "Chất lượng giảng dạy kém",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  INAPPROPRIATE_BEHAVIOR: {
    label: "Hành vi không phù hợp",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  SESSION_TECHNICAL_ISSUE: {
    label: "Lỗi kỹ thuật buổi học",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  OTHER: {
    label: "Khác",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

export const PACKAGE_MAP: Record<PackageType, MapType> = {
  MEMBER: {
    label: "Gói Cơ Bản",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  VIP_MEMBER: {
    label: "Gói VIP",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
};

export const RULE_TYPE_MAP: Record<RuleTypeEnum, MapType> = {
  CONDITION: {
    label: "Bệnh lý",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  AGE: {
    label: "Độ tuổi",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  GENDER: {
    label: "Giới tính",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  WEIGHT: {
    label: "Cân nặng",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  HEIGHT: {
    label: "Chiều cao",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  DIFFICULTY_LEVEL: {
    label: "Độ khó",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  HEALTH_PROFILE: {
    label: "Hồ sơ sức khỏe",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  MEDICATION: {
    label: "Thuốc",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  ALLERGY: {
    label: "Dị ứng",
    bgColor: "bg-red-200",
    textColor: "text-red-800",
  },
};

export const RULE_SEVERITY_MAP: Record<RuleSeverityType, MapType> = {
  LOW: {
    label: "Thấp",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  MEDIUM: {
    label: "Trung bình",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  HIGH: {
    label: "Cao",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
};

export const RULE_ACTION_MAP: Record<RuleActionType, MapType> = {
  BLOCK: {
    label: "Chặn",
    bgColor: "bg-red-200",
    textColor: "text-red-800",
  },
  WARN: {
    label: "Cảnh báo",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
};

export const RULE_OPERATOR_MAP: Record<RuleOperatorType, { label: string }> = {
  EQUALS: { label: "=" },
  NOT_EQUALS: { label: "≠" },
  GREATER_THAN: { label: ">" },
  GREATER_THAN_OR_EQUAL: { label: "≥" },
  LESS_THAN: { label: "<" },
  LESS_THAN_OR_EQUAL: { label: "≤" },
  CONTAINS: { label: "Chứa" },
  NOT_CONTAINS: { label: "Không chứa" },
  IN: { label: "Thuộc" },
  NOT_IN: { label: "Không thuộc" },
};

export const SYSTEM_CONFIG_LABEL: Record<SystemKeyType, string> = {
  PLATFORM_FEE_PERCENTAGE: "Phần trăm phí nền tảng",
  HOLDING_DAYS: "Số ngày giữ tiền",
  HOURS_PER_SLOT: "Số giờ mỗi slot",
  EMAIL_ADMIN: "Email quản trị viên",
  VENDOR_CONFIRM_ORDER_HOURS: "Số giờ xác nhận đơn hàng từ nhà cung cấp",
};

export const BOOKING_STATUS_MAP: Record<BookingStatusType, MapType> = {
  SCHEDULED: {
    label: "Đã lên lịch",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  CANCELLED_BY_COACH: {
    label: "HLV đã huỷ",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  CANCELLED_BY_TRAINEE: {
    label: "Học viên đã huỷ",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  READY: {
    label: "Sẵn sàng",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  IN_PROGRESS: {
    label: "Đang diễn ra",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  NO_SHOW_BY_COACH: {
    label: "HLV vắng mặt",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  NO_SHOW_BY_TRAINEE: {
    label: "Học viên vắng mặt",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  COMPLETED: {
    label: "Hoàn thành",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
};

export const BOOKING_TYPE_MAP: Record<BookingType, MapType> = {
  SINGLE: {
    label: "Buổi lẻ",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  PERSONAL_TRAINING_PACKAGE: {
    label: "Gói PT",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
};

export const LIVE_SESSION_STATUS_MAP: Record<LiveSessionStatusType, MapType> = {
  PENDING: {
    label: "Chưa bắt đầu",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  ACTIVE: {
    label: "Đang diễn ra",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  COMPLETED: {
    label: "Hoàn thành",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  NO_SHOW: {
    label: "Vắng mặt",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  FAILED: {
    label: "Lỗi",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
};

// FUNCTION
export const buildSelectOptions = <T extends string>(
  values: readonly T[],
  getLabel: (value: T) => string,
): Option<T>[] => {
  return values.map((v) => ({
    value: v,
    label: getLabel(v),
  }));
};

// GET
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
        bgColor: "bg-red-100",
        textColor: "text-red-700",
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

export const getCategoryTypeConfig = (type: CategoryType) =>
  CATEGORY_TYPE_MAP[type];

export const getRegionLabels = (regions?: string[] | null) => {
  if (!regions || regions.length === 0) return ["Toàn quốc"];

  return regions.map((r) => REGION_LABEL[r as keyof typeof REGION_LABEL] || r);
};

export const getTransactionTypeConfig = (type: TransactionTypeEnum) =>
  TRANSACTION_TYPE_MAP[type];

export const getTransactionFlow = (
  type: TransactionTypeEnum,
): TransactionFlowType => TRANSACTION_FLOW_MAP[type];

export const getTransactionFlowConfig = (type: TransactionTypeEnum) => {
  const flow = getTransactionFlow(type);
  return TRANSACTION_FLOW_CONFIG[flow];
};

// TRANSACTION CATEGORY
export const TRANSACTION_CATEGORY_MAP: Record<
  TransactionCategoryType,
  { label: string; bgColor: string; textColor: string }
> = {
  ALL: {
    label: "Tất cả",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  WALLET: {
    label: "Ví",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  ORDER: {
    label: "Đơn hàng",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  BOOKING: {
    label: "Đặt HLV",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
  },
  PACKAGE: {
    label: "Gói",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  COURSE: {
    label: "Khóa học",
    bgColor: "bg-blue-200",
    textColor: "text-blue-800",
  },
  FEES: {
    label: "Phí",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  VENDOR: {
    label: "NCC",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  OTHER: {
    label: "Khác",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
};

export const getTransactionCategory = (
  type: TransactionTypeEnum,
): TransactionCategoryType => {
  switch (type) {
    case "WALLET_TOP_UP":
    case "WALLET_WITHDRAWAL":
      return "WALLET";
    case "ORDER":
      return "ORDER";
    case "BOOKING_COACH":
    case "BOOKING_COACH_REFUND":
      return "BOOKING";
    case "SUBSCRIPTION_PACKAGE":
    case "SUBSCRIPTION_PRORATION_REFUND":
    case "SUBSCRIPTION_UPGRADE":
      return "PACKAGE";
    case "COURSE":
      return "COURSE";
    case "PLATFORM_FEE":
    case "SHIPPING_FEE_THIRD_PARTY":
    case "SHIPPING_FEE_VENDOR":
      return "FEES";
    case "VENDOR_PAYOUT":
    case "VENDOR_EARNING":
      return "VENDOR";
    case "REFUND":
    case "PENALTY":
      return "OTHER";
    default:
      return "OTHER";
  }
};

export const getTransactionCategoryConfig = (
  category: TransactionCategoryType,
) => TRANSACTION_CATEGORY_MAP[category];

export const filterTransactionsByCategory = (
  transactions: any[],
  category: TransactionCategoryType,
) => {
  if (category === "ALL") return transactions;
  return transactions.filter(
    (t) => getTransactionCategory(t.transactionType) === category,
  );
};

export const getExerciseTypeConfig = (type: ExerciseTypeEnum) =>
  EXERCISE_TYPE_MAP[type];

export const getExerciseTypeLabel = (type: ExerciseTypeEnum) =>
  EXERCISE_TYPE_MAP[type].label;

export const getBreathingRuleConfig = (rule: BreathingRuleType) =>
  BREATHING_RULE_MAP[rule];

export const getBreathingRuleLabel = (rule: BreathingRuleType) =>
  BREATHING_RULE_MAP[rule].label;

export const getGenderConfig = (gender: GenderType) => GENDER_MAP[gender];

export const getGenderLabel = (gender: GenderType) => GENDER_MAP[gender].label;

export const getWorkoutLevelConfig = (level: WorkoutLevelType) =>
  WORKOUT_LEVEL_MAP[level];

export const getWorkoutLevelLabel = (level: WorkoutLevelType) =>
  WORKOUT_LEVEL_MAP[level].label;

export const getWorkoutFrequencyConfig = (freq: WorkoutFrequencyType) =>
  WORKOUT_FREQUENCY_MAP[freq];

export const getWorkoutFrequencyLabel = (freq: WorkoutFrequencyType) =>
  WORKOUT_FREQUENCY_MAP[freq].label;

export const getReportReasonConfig = (reason: ReportReasonType) =>
  REPORT_REASON_MAP[reason];

export const getReportReasonLabel = (reason: ReportReasonType) =>
  REPORT_REASON_MAP[reason].label;

export const getPackageConfig = (type: PackageType) => PACKAGE_MAP[type];

export const getPackageLabel = (type: PackageType): string =>
  PACKAGE_MAP[type].label;

export const getRuleTypeConfig = (type: RuleTypeEnum) => RULE_TYPE_MAP[type];

export const getRuleTypeLabel = (type: RuleTypeEnum) =>
  RULE_TYPE_MAP[type].label;

export const getRuleSeverityConfig = (severity: RuleSeverityType) =>
  RULE_SEVERITY_MAP[severity];

export const getRuleSeverityLabel = (severity: RuleSeverityType) =>
  RULE_SEVERITY_MAP[severity].label;

export const getRuleActionConfig = (action: RuleActionType) =>
  RULE_ACTION_MAP[action];

export const getRuleActionLabel = (action: RuleActionType) =>
  RULE_ACTION_MAP[action].label;

export const getRuleOperatorLabel = (operator: RuleOperatorType) =>
  RULE_OPERATOR_MAP[operator].label;

export const getSystemConfigLabel = (key: SystemKeyType): string =>
  SYSTEM_CONFIG_LABEL[key];

export const getBookingStatusConfig = (status: BookingStatusType) =>
  BOOKING_STATUS_MAP[status];

export const getBookingStatusLabel = (status: BookingStatusType) =>
  BOOKING_STATUS_MAP[status].label;

export const getBookingTypeConfig = (type: BookingType) =>
  BOOKING_TYPE_MAP[type];

export const getBookingTypeLabel = (type: BookingType) =>
  BOOKING_TYPE_MAP[type].label;

export const getLiveSessionStatusConfig = (status: LiveSessionStatusType) =>
  LIVE_SESSION_STATUS_MAP[status];

export const getLiveSessionStatusLabel = (status: LiveSessionStatusType) =>
  LIVE_SESSION_STATUS_MAP[status].label;

// OPTIONS
export const RULE_TYPE_OPTIONS = Object.values(RULE_TYPE);

export const RULE_SEVERITY_OPTIONS = Object.values(RULE_SEVERITY);

export const RULE_ACTION_OPTIONS = Object.values(RULE_ACTION);

export const RULE_OPERATOR_OPTIONS = Object.values(RULE_OPERATOR);

export const RULE_TYPE_SELECT_OPTIONS = buildSelectOptions(
  RULE_TYPE_OPTIONS,
  getRuleTypeLabel,
);

export const RULE_SEVERITY_SELECT_OPTIONS = buildSelectOptions(
  RULE_SEVERITY_OPTIONS,
  getRuleSeverityLabel,
);

export const RULE_ACTION_SELECT_OPTIONS = buildSelectOptions(
  RULE_ACTION_OPTIONS,
  getRuleActionLabel,
);

export const RULE_OPERATOR_SELECT_OPTIONS = buildSelectOptions(
  RULE_OPERATOR_OPTIONS,
  getRuleOperatorLabel,
);

export const REPORT_REASON_OPTIONS = Object.values(REPORT_REASON);

export const REPORT_REASON_SELECT_OPTIONS = buildSelectOptions(
  REPORT_REASON_OPTIONS,
  getReportReasonLabel,
);

export const EXERCISE_TYPE_OPTIONS = Object.values(EXERCISE_TYPE);

export const EXERCISE_TYPE_SELECT_OPTIONS = buildSelectOptions(
  EXERCISE_TYPE_OPTIONS,
  getExerciseTypeLabel,
);

export const BREATHING_RULE_OPTIONS = Object.values(BREATHING_RULE);

export const BREATHING_RULE_SELECT_OPTIONS = buildSelectOptions(
  BREATHING_RULE_OPTIONS,
  getBreathingRuleLabel,
);

// FORMAT
export const formatSystemConfigValue = (key: SystemKeyType, value: string) => {
  switch (key) {
    case "PLATFORM_FEE_PERCENTAGE":
      return `${value}%`;
    case "HOLDING_DAYS":
      return `${value} ngày`;
    case "HOURS_PER_SLOT":
      return `${value} giờ`;
    default:
      return value;
  }
};

// MAPPER
export const mapToUpdateIngredientReq = (
  data: IngredientWithRulesType,
): UpdateIngredientReq => ({
  name: data.name,
  ingredientRules: data.ingredientRules.map((rule) => ({
    ruleId: rule.ingredientRuleId,
    ruleType: rule.ruleType,
    ruleDescription: rule.ruleDescription,
    operator: rule.operator,
    value: rule.value,
    severity: rule.severity,
    action: rule.action,
  })),
});
