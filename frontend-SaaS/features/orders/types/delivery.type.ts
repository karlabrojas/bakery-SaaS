export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

export interface Delivery {
  id: string;
  order_id: string;
  bakery_id: string;

  delivery_type: "PICKUP" | "DELIVERY";
  deliveryType?: "PICKUP" | "DELIVERY";

  address: string;

  recipient_name?: string;
  recipientName?: string;

  recipient_phone?: string;
  recipientPhone?: string;

  estimated_delivery?: string;
  estimatedDelivery?: string;

  delivery_at?: string;
  deliveryAt?: string;

  status: DeliveryStatus;

  notes?: string;

  completed_by?: string;
  completedBy?: string;

  created_at: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}
