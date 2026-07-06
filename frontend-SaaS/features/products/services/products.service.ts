import { Product } from "../types/product.type";

const api = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Sesión no válida");
  }

  return token;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${api}/api/products`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener productos");
  }

  return json.data.map((product: Product) => ({
    ...product,
    quantity: 0,
  }));
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${api}/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener el producto");
  }

  return {
    ...json.data,
    quantity: 0,
  };
}

export async function createProduct(formData: FormData): Promise<Product> {
  const response = await fetch(`${api}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al registrar el producto");
  }

  return json.data;
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<Product> {
  const response = await fetch(`${api}/api/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al actualizar el producto");
  }

  return json.data;
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const response = await fetch(`${api}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al eliminar el producto");
  }

  return json;
}
