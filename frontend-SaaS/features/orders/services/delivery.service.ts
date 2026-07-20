import { Delivery } from "../types/delivery.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

const getBakeryId = () => localStorage.getItem("bakeryId");

function mapToBackendDTO(data: Partial<Delivery>) {
  const anyData = data as any;
  return {
    deliveryType: data.delivery_type || anyData.deliveryType,
    address: data.address,
    recipientName: data.recipient_name || anyData.recipientName,
    recipientPhone: data.recipient_phone || anyData.recipientPhone,
    estimatedDelivery: data.estimated_delivery || anyData.estimatedDelivery,
    notes: data.notes,
  };
}

export async function createDelivery(
  orderId: string,
  data: Partial<Delivery>,
): Promise<Delivery> {
  const bakeryId = getBakeryId();
  const mappedData = mapToBackendDTO(data);

  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ...mappedData, bakeryId }),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error creando entrega");
  return json.data;
}

export async function getDelivery(orderId: string): Promise<Delivery> {
  const bakeryId = getBakeryId();

  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery?bakeryId=${bakeryId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error obteniendo entrega");
  return json.data;
}

export async function updateDelivery(
  orderId: string,
  data: Partial<Delivery>,
): Promise<Delivery> {
  const bakeryId = getBakeryId();
  const mappedData = mapToBackendDTO(data);

  const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ...mappedData, bakeryId }),
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
  const bakeryId = getBakeryId();

  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status, bakeryId }),
    },
  );

  const json = await response.json();
  if (!response.ok)
    throw new Error(json.message || "Error cambiando estado de entrega");
  return json.data;
}

export async function completeDelivery(orderId: string): Promise<Delivery> {
  const bakeryId = getBakeryId();

  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery/complete`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ bakeryId }),
    },
  );

  const json = await response.json();
  if (!response.ok)
    throw new Error(json.message || "Error completando entrega");
  return json.data;
}

export async function deleteDelivery(orderId: string): Promise<void> {
  const bakeryId = getBakeryId();
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/delivery?bakeryId=${bakeryId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Error eliminando entrega");
}
