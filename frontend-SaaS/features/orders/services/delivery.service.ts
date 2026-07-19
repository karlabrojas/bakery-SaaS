const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createDelivery(orderId: string, data: any) {
  const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error creando entrega");

  return response.json();
}

export async function getDelivery(orderId: string) {
  const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Error obteniendo entrega");

  return response.json();
}

export async function updateDelivery(orderId: string, data: any) {
  const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error actualizando entrega");

  return response.json();
}

export async function changeDeliveryStatus(orderId: string, status: string) {
  const response = await fetch(`${API_URL}/orders/${orderId}/delivery/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) throw new Error("Error cambiando estado");

  return response.json();
}

export async function completeDelivery(orderId: string) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/delivery/complete`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  if (!response.ok) throw new Error("Error completando entrega");

  return response.json();
}

export async function deleteDelivery(orderId: string) {
  const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Error eliminando entrega");

  return response.json();
}
