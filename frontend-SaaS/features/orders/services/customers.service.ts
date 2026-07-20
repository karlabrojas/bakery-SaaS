const api = process.env.NEXT_PUBLIC_API_URL;

// Definimos la interfaz para mantener limpio el tipado
export interface Customer {
  id: string;
  name: string;
  phone: string;
}

function getToken(): string {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Sesión no válida");
  return token;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${api}/api/customers`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al obtener clientes");
  const json = await res.json();
  return json.data;
}

// 🛠️ Ajustado para recibir (name, phone) directamente como lo pide el modal
export async function createCustomer(
  name: string,
  phone: string,
): Promise<Customer> {
  const res = await fetch(`${api}/api/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, phone }), // 👈 Se empaqueta aquí dentro en el formato JSON que espera tu API
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear cliente");
  return json.data;
}
