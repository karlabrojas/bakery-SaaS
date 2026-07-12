"use client";

import { useEffect, useState } from "react";
import { activarProduct, deactivateProduct, deleteProduct, fetchAllProducts, updateProduct } from "../services/products.service";
import { Product } from "../types/product.type";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        setLoading(true);
      
        try {
            const data = await fetchAllProducts();
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
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", String(data.price));
            formData.append("category", data.category);

            await updateProduct(id, formData);
            await loadProducts();
        } catch (err: any) {
            throw err;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            throw err;
        }
    };

    const handleDeactivate = async (id: string) => {
        try {
            await deactivateProduct(id);
            await loadProducts();
        } catch (err: any) {
            throw err;
        }
    };

    const handleActivate = async (id: string) => {
        try {
            await activarProduct(id);
            await loadProducts();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { products, loading, error, handleUpdate, loadProducts, handleDelete, handleActivate, handleDeactivate };
}
