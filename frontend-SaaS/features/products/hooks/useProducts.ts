"use client";

import { useEffect, useState } from "react";
import { deleteProduct, fetchProducts } from "../services/products.service";
import { Product } from "../types/product.type";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar el producto.");
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    handleDelete,
  };
}
