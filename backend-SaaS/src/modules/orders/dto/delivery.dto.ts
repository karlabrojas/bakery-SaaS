import { DeliveryStatus, DeliveryType } from "../interfaces/delivery";

export interface CreateDeliveryDTO {
  orderId: string;
  deliveryType: DeliveryType;
  address?: string;
  recipientName?: string;
  recipientPhone?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UpdateDeliveryDTO {
  deliveryType?: DeliveryType;
  address?: string;
  recipientName?: string;
  recipientPhone?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  status?: DeliveryStatus;
  notes?: string;
}
