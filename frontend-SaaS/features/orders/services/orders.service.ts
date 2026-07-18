const api = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

export async function fetchOrders() {
    const res = await fetch(`${api}/api/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Error al obtener pedidos");
    const json = await res.json();
    return json.data;
}

export async function fetchOrderById(id: string) {
    const res = await fetch(`${api}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Error al obtener pedido");
    const json = await res.json();
    return json.data;
}

export async function createOrder(data: any) {
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

export async function updateOrder(id: string, data: any) {
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


export async function deleteOrder(id: string) {
    const res = await fetch(`${api}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Error al eliminar pedido");
    return json.data;
}

export async function changeOrderStatus(id: string, status: string, comments?: string) {
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

export async function convertOrderToSale(id: string) {
    const res = await fetch(`${api}/api/orders/${id}/convert-sale`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Error al convertir pedido");
    return json.data;
}

