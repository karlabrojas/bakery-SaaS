import { PaymentMethod } from "./payment.type";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

// export type DeliveryType = "PICKUP" | "DELIVERY";

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
  payment_status: "PENDING" | "PARTIAL" | "PAID";
  remaining_balance: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

// 🌟 AGREGAMOS ESTAS DOS INTERFACES PARA DAR SOPORTE AL DTO

export interface CreateAdvancePaymentDTO {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
}

// export interface CreateDeliveryDTO {
//   address: string;
//   recipientName?: string;
//   recipientPhone?: string;
//   notes?: string;
//   estimatedDelivery?: string; // Formato ISO String para las fechas
// }

// // 🌟 TU DTO ACTUALIZADO
// export interface CreateOrderDTO {
//   customerId?: string;
//   deliveryType: DeliveryType;
//   deliveryDate: string;
//   deliveryTime: string;
//   discount?: number;
//   notes?: string;
//   items: {
//     productId: string;
//     quantity: number;
//     observations?: string;
//   }[];

//   // 👇 Agregamos los campos que te pide el Modal como opcionales (?)
//   initialAdvance?: CreateAdvancePaymentDTO;
//   deliveryData?: CreateDeliveryDTO;
// }

export type DeliveryType = "PICKUP" | "DELIVERY";

export interface CreateDeliveryDTO {
  address: string;
  recipientName?: string;
  recipientPhone?: string;
  notes?: string;
  estimatedDelivery?: string;
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
  initialAdvance?: {
    amount: number;
    paymentMethod: any;
    reference?: string;
  };
  deliveryData?: CreateDeliveryDTO; // 👈 Agregamos esto explícitamente
}
