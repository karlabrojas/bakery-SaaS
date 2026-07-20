export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PRODUCTION = "IN_PRODUCTION",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum DeliveryType {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  IN_ROUTE = "IN_ROUTE",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export interface Delivery {
  id: string;
  orderId: string;
  deliveryType: DeliveryType;
  address?: string;
  recipientName?: string;
  recipientPhone?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  status: DeliveryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
