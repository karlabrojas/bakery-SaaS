"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Product } from "../types/product.type";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) =>
        setProducts(
          data.map((p: any) => ({
            id: p.uid,
            name: p.name,
            description: p.description ?? "",
            price: Number(p.price),
            quantity: 0,
          })),
        ),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
  };
}
