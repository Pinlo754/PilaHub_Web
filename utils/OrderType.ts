// ================= ENUM TYPES =================
export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  READY: "READY",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  FAILED_DELIVERY: "FAILED_DELIVERY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_DETAIL_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  READY: "READY",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
  REFUNDED: "REFUNDED",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

export type OrderDetailStatusType =
  (typeof ORDER_DETAIL_STATUS)[keyof typeof ORDER_DETAIL_STATUS];

export const SHIPMENT_STATUS = {
  DRAFT: "DRAFT",
  READY_TO_PICK: "READY_TO_PICK",
  PICKING: "PICKING",
  PICKED: "PICKED",
  STORING: "STORING",
  TRANSPORTING: "TRANSPORTING",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
  DELIVERY_FAIL: "DELIVERY_FAIL",
  RETURN: "RETURN",
  RETURNING: "RETURNING",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
} as const;

export type ShipmentStatusType =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

// ================= SUB TYPES =================
export type OrderDetailType = {
  orderDetailId: string;
  orderId: string;
  productId: string;
  shipmentId: string | null;
  status: OrderDetailStatusType;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  installationRequest: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShipmentType = {
  shipmentId: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  status: ShipmentStatusType;
  shippingProvider: string | null;
  trackingNumber: string | null;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  returnDeadline: string | null;
  payoutReleaseDate: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  orderDetails: OrderDetailType[];
  createdAt: string;
  updatedAt: string;
};

// ================= MAIN TYPE =================
export type OrderType = {
  orderId: string;
  accountId: string;
  status: OrderStatusType;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes: string;
  orderNumber: string;
  paymentMethod: string;
  paid: boolean;
  paidOut: boolean;
  paidAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  orderDetails: OrderDetailType[];
  shipments: ShipmentType[];
  createdAt: string;
  updatedAt: string;
};
