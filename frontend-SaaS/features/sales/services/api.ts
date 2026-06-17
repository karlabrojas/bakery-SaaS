const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  const res = await fetch(`${api}/api/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  const json = await res.json();
  return json; 
}