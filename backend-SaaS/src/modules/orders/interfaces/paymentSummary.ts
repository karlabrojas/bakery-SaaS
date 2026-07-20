export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
}

export interface PaymentSummary {
  total: number;
  paid: number;
  remaining: number;
  status: PaymentStatus;
}
