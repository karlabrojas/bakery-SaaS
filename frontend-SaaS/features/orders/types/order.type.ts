export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export type DeliveryType = "PICKUP" | "DELIVERY";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  observations?: string;
}

export interface Order {
  id: string;
  folio: string;
  bakery_id: string;
  customer_id?: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  delivery_date: string;
  delivery_time: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_status: "PENDING" | "PARTIAL" | "PAID"; // Sincronizado con backend
  remaining_balance: number; // Sincronizado con backend
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface CreateOrderDTO {
  customerId?: string;
  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryTime: string;
  discount?: number;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    observations?: string;
  }[];
}
