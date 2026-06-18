const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  const res = await fetch(`${api}/api/products`);

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  const json = await res.json();

  return json.data;
}

interface CreateSalePayload {
  paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";

  items: {
    productId: string;
    quantity: number;
  }[];
}

export async function createSale(payload: CreateSalePayload) {
  const response = await fetch(`${api}/api/sales`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error);
  }

  return response.json();
}

export async function getSales() {
  const response = await fetch(`${api}/api/sales`);

  if (!response.ok) {
    throw new Error("Error al obtener ventas");
  }

  const json = await response.json();

  return json.data;
}

export const updateSale = async (id: string, data: any) => {
  const res = await fetch(`${api}/api/sales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating sale");
  return res.json();
};

export const deleteSale = async (id: string) => {
  const res = await fetch(`${api}/api/sales/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error deleting sale");
  return res.json();
};
