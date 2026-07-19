import { Order, CreateOrderDTO } from "../types/order.type";

const api = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${api}/api/orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener pedidos");
  return json.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const res = await fetch(`${api}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener pedido");
  return json.data;
}

export async function createOrder(data: CreateOrderDTO): Promise<Order> {
  const res = await fetch(`${api}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear pedido");
  return json.data;
}

export async function updateOrder(
  id: string,
  data: Partial<CreateOrderDTO>,
): Promise<Order> {
  const res = await fetch(`${api}/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al actualizar pedido");
  return json.data;
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${api}/api/orders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al eliminar pedido");
}

export async function changeOrderStatus(
  id: string,
  status: string,
  comments?: string,
): Promise<Order> {
  const res = await fetch(`${api}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status, comments }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al cambiar estado");
  return json.data;
}

export async function convertOrderToSale(id: string): Promise<any> {
  const res = await fetch(`${api}/api/orders/${id}/convert-sale`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al convertir pedido");
  return json.data;
}

export async function fetchOrderHistory(id: string): Promise<any[]> {
  const res = await fetch(`${api}/api/orders/${id}/history`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener historial");
  return json.data;
}
