import { Delivery } from "../types/delivery.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

export async function createDelivery(
  orderId: string,
  data: Partial<Delivery>,
): Promise<Delivery> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error creando entrega");
  return json.data;
}

export async function getDelivery(orderId: string): Promise<Delivery> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error obteniendo entrega");
  return json.data;
}

export async function updateDelivery(
  orderId: string,
  data: Partial<Delivery>,
): Promise<Delivery> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok)
    throw new Error(json.message || "Error actualizando entrega");
  return json.data;
}

export async function changeDeliveryStatus(
  orderId: string,
  status: string,
): Promise<Delivery> {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  const json = await response.json();
  if (!response.ok)
    throw new Error(json.message || "Error cambiando estado de entrega");
  return json.data;
}

export async function completeDelivery(orderId: string): Promise<Delivery> {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery/complete`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  const json = await response.json();
  if (!response.ok)
    throw new Error(json.message || "Error completando entrega");
  return json.data;
}

export async function deleteDelivery(orderId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error eliminando entrega");
}
