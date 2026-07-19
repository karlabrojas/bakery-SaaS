export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
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

export interface RegisterAdvanceDTO {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  observations?: string;
}

export interface FinalPaymentDTO {
  paymentMethod: PaymentMethod;
  reference?: string;
  observations?: string;
}

export interface PaymentSummary {
  total: number;
  paid: number;
  remaining: number;
  status: PaymentStatus;
}
