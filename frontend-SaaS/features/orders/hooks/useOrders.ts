"use client";

import { useEffect, useState } from "react";
import { fetchOrders, deleteOrder, convertOrderToSale } from "../services/orders.service";
import { Order } from "../types/order.type";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [convirtiendo, setConvirtiendo] = useState<Order | null>(null);
    const [loadingConvert, setLoadingConvert] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteOrder(id);
            await loadOrders();
        } catch (err: any) {
            throw err;
        }
    };

    const handleConvertToSale = async (id: string) => {
        try {
            await convertOrderToSale(id);
            await loadOrders();
        } catch (err: any) {
            throw err;
        }
    };

    return { orders, loading, error, loadOrders, handleDelete, handleConvertToSale };
}