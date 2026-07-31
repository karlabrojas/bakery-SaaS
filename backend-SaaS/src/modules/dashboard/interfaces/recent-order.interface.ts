import { OrderStatus } from "../../orders/interfaces/order.interface";

export interface RecentOrder {
  id: string;

  folio: string;

  customer: {
    id: string;
    name: string;
  } | null;

  total: number;

  status: OrderStatus;

  deliveryDate: string;

  deliveryTime: string;
}
