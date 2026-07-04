import { Product } from "../types/product.type";

const api = process.env.NEXT_PUBLIC_API_URL;

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: string;
}

export async function fetchProducts(): Promise<Product[]> {
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
    console.log(json.data);

    return json.data.map((product: Product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: 0,
        imageUrl: product.imageUrl,
    }));
}

export async function createProduct(data: CreateProductDto) {
    const response = await fetch(`${api}/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message || "Error al registrar el producto");
    }

    return json;
}


export async function updateProduct(id: string, data: CreateProductDto) {
    const res = await fetch(`${api}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Error al actualizar producto");
    return json;
}

export async function deleteProduct(id: string) {
    const res = await fetch(`${api}/api/products/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar producto");
    return res.json();
}