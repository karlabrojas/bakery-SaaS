const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  const res = await fetch(`${api}/api/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  const json = await res.json();
  return json; 
}

interface SalePayload {
  product: string;
  quantity: number;
  total: number;
}

export async function createSale(payload: SalePayload) {
  const respuesta = await fetch(`${api}/api/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const errorBody = await respuesta.text(); 
    console.error("Status:", respuesta.status, "Body:", errorBody);
    throw new Error(`Error al registrar la venta: ${respuesta.status}`);
  }

  return respuesta.json();
}