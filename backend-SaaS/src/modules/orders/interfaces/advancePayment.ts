export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
}

export interface AdvancePayment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  observations?: string;
  createdBy?: string;
  createdAt: string;
}
