const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${api}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  const json = await res.json();
  return json.data;
}

interface CreateSalePayload {
  paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";
  items: { productId: string; quantity: number }[];
}

export async function createSale(payload: CreateSalePayload) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${api}/api/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function getSales() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${api}/api/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener ventas");
  const json = await response.json();
  return json.data;
}

export const updateSale = async (id: string, data: any) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${api}/api/sales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating sale");
  return res.json();
};

export const deleteSale = async (id: string) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${api}/api/sales/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error deleting sale");
  return res.json();
};
