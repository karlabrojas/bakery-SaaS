import { PaymentMethod } from "../interfaces/advancePayment";
import { DeliveryType, OrderStatus } from "../interfaces/delivery";

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  observations?: string;
}

// export interface CreateOrderDTO {
//   bakeryId: string;
//   customerId?: string;
//   deliveryType: DeliveryType;
//   deliveryDate: string;
//   deliveryTime: string;
//   discount?: number;
//   notes?: string;
//   items: CreateOrderItemDTO[];
//   initialAdvance?: {
//     amount: number;
//     paymentMethod: PaymentMethod;
//     reference?: string;
//   };
// }

export interface UpdateOrderDTO {
  customerId?: string;
  deliveryType?: DeliveryType;
  deliveryDate?: string;
  deliveryTime?: string;
  discount?: number;
  notes?: string;
  items?: CreateOrderItemDTO[];
}

export interface ChangeStatusDTO {
  status: OrderStatus;
  comments?: string;
}

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  observations?: string;
}

export interface CreateDeliveryDataDTO {
  address?: string;
  recipientName?: string;
  recipientPhone?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface CreateOrderDTO {
  bakeryId: string;
  customerId?: string;

  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryTime: string;

  discount?: number;
  notes?: string;

  items: CreateOrderItemDTO[];

  initialAdvance?: {
    amount: number;
    paymentMethod: PaymentMethod;
    reference?: string;
  };

  deliveryData?: CreateDeliveryDataDTO;
}
