import {
  AdvancePayment,
  RegisterAdvanceDTO,
  PaymentSummary,
  FinalPaymentDTO,
} from "../types/payment.type";

const api = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

export async function registerAdvance(
  orderId: string,
  data: RegisterAdvanceDTO,
): Promise<AdvancePayment> {
  const res = await fetch(`${api}/api/orders/${orderId}/payments/advance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al registrar anticipo");
  }

  return json.data;
}

export async function fetchAdvances(
  orderId: string,
): Promise<AdvancePayment[]> {
  const res = await fetch(`${api}/api/orders/${orderId}/payments/advances`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener anticipos");
  }

  return json.data;
}

export async function fetchPaymentSummary(
  orderId: string,
): Promise<PaymentSummary> {
  const res = await fetch(`${api}/api/orders/${orderId}/payments/summary`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener resumen de pagos");
  }

  return json.data;
}

export async function payRemaining(
  orderId: string,
  data: FinalPaymentDTO,
): Promise<AdvancePayment> {
  const res = await fetch(`${api}/api/orders/${orderId}/payments/final`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al registrar pago final");
  }

  return json.data;
}
