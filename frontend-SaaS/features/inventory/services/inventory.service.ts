const api = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => localStorage.getItem("accessToken");

export async function obtenerIngredientes() {
    const respuesta = await fetch(`${api}/api/inventory`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!respuesta.ok) throw new Error("Error al obtener ingredientes");
    const json = await respuesta.json();
    return json.data;
}

export async function crearIngrediente(datos: {
    name: string;
    quantity: number;
    unit: string;
    minimum_stock?: number;
}) {
    const respuesta = await fetch(`${api}/api/inventory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(datos),
    });
    const json = await respuesta.json();
    if (!respuesta.ok) throw new Error(json.message || "Error al crear ingrediente");
    return json.data;
}

export async function actualizarIngrediente(id: string, datos: {
    name?: string;
    quantity?: number;
    unit?: string;
    minimum_stock?: number;
}) {
    console.log("Datos enviados al backend:", datos);

    const respuesta = await fetch(`${api}/api/inventory/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(datos),
    });
    const json = await respuesta.json();
    if (!respuesta.ok) throw new Error(json.message || "Error al actualizar ingrediente");
    return json.data;
}

export async function eliminarIngrediente(id: string) {
    const respuesta = await fetch(`${api}/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const json = await respuesta.json();
    if (!respuesta.ok) throw new Error(json.message || "Error al eliminar ingrediente");
    return json.data;
}

export async function registrarEntrada(datos: {
    inventory_id: number;
    quantity: number;
    reason?: string;
    movement_date: string;
}) {
    const respuesta = await fetch(`${api}/api/inventory/movements`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(datos),
    });
    const json = await respuesta.json();
    if (!respuesta.ok) throw new Error(json.message || "Error al registrar entrada");
    return json.data;
}

export async function registrarSalida(datos: {
    inventory_id: number;
    quantity: number;
    reason?: string;
    movement_date: string;
}) {
    const respuesta = await fetch(`${api}/api/inventory/movements/salida`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(datos),
    });
    const json = await respuesta.json();
    if (!respuesta.ok) throw new Error(json.message || "Error al registrar salida");
    return json.data;
}