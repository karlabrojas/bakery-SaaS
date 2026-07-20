import { useState } from "react";

import {
  registerAdvance,
  fetchAdvances,
  fetchPaymentSummary,
  payRemaining,
} from "../services/payment.service";

import {
  AdvancePayment,
  RegisterAdvanceDTO,
  FinalPaymentDTO,
  PaymentSummary,
} from "../types/payment.type";

export function usePayments() {
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadAdvances(orderId: string) {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdvances(orderId);
      setAdvances(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary(orderId: string) {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPaymentSummary(orderId);
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createAdvance(orderId: string, data: RegisterAdvanceDTO) {
    setLoading(true);
    setError("");

    try {
      const payment = await registerAdvance(orderId, data);

      setAdvances((prev) => [...prev, payment]);

      await loadSummary(orderId);

      return payment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function registerFinalPayment(orderId: string, data: FinalPaymentDTO) {
    setLoading(true);
    setError("");

    try {
      const payment = await payRemaining(orderId, data);

      await loadAdvances(orderId);
      await loadSummary(orderId);

      return payment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    advances,
    summary,
    loading,
    error,

    loadAdvances,
    loadSummary,

    createAdvance,
    registerFinalPayment,
  };
}
