export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

export interface Delivery {
  id: string;
  order_id: string;
  bakery_id: string; // Añadido para el control multi-tenant
  delivery_type: "PICKUP" | "DELIVERY";
  address: string;
  recipient_name: string;
  recipient_phone: string;
  estimated_delivery?: string; // Timestamptz
  delivery_at?: string; // Timestamptz
  status: DeliveryStatus;
  notes?: string;
  completed_by?: string; // ID del repartidor que entregó
  created_at: string;
  updated_at?: string;
}
