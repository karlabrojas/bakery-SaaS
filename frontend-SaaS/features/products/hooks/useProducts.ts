"use client";

import { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "../services/products.service";
import { Product } from "../types/product.type";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);


    const handleUpdate = async (id: string, data: {
        name: string;
        description: string;
        price: number;
        category: string;
    }) => {
        try {
            await updateProduct(id, data);
            await loadProducts();
        } catch (err: any) {
            throw err;
        }
    };

    return { products, loading, error, handleUpdate, loadProducts };
}