export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

export interface Delivery {
  id: string;

  order_id: string;

  address: string;

  reference?: string;

  status: DeliveryStatus;

  delivery_date: string;

  delivery_time: string;

  notes?: string;

  created_at: string;
}
