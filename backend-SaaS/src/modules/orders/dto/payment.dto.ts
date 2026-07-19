import { PaymentMethod } from "../interfaces/advancePayment";

export interface RegisterAdvancePaymentDTO {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  observations?: string;
}

export interface FinalPaymentDTO {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
}
