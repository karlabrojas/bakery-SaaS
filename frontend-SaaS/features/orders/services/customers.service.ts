const api = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => localStorage.getItem("accessToken");

export async function fetchCustomers() {
    const res = await fetch(`${api}/api/customers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Error al obtener clientes");
    const json = await res.json();
    return json.data;
}

export async function createCustomer(data: {
    name: string;
    phone: string;
}) {
    const res = await fetch(`${api}/api/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Error al crear cliente");
    return json.data;
}