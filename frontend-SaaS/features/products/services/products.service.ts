const api = process.env.NEXT_PUBLIC_API_URL;

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: string;
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