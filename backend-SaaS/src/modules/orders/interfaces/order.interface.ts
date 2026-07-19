import { DeliveryType, OrderStatus } from "./delivery";

export interface Order {
  id: string;
  folio: string;
  bakeryId: string;
  customerId?: string;
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryTime: string;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  observations?: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  previousStatus?: OrderStatus;
  currentStatus: OrderStatus;
  changedBy: string;
  comments?: string;
  changedAt: string;
}
export { OrderStatus, DeliveryType };
