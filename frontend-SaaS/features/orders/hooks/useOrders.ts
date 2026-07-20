"use client";

import { useEffect, useState } from "react";
import {
  fetchOrders,
  deleteOrder,
  convertOrderToSale,
  createOrder,
} from "../services/orders.service";
import { Order, CreateOrderDTO } from "../types/order.type";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingConvert, setLoadingConvert] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (orderData: CreateOrderDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrder(orderData);
      await loadOrders();
      return newOrder;
    } catch (err: any) {
      setError(err.message || "Error al crear el pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteOrder(id);
      await loadOrders();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToSale = async (id: string) => {
    setLoadingConvert(true);
    try {
      await convertOrderToSale(id);
      await loadOrders();
    } catch (err: any) {
      setError(err.message || "Error al convertir pedido a venta");
      throw err;
    } finally {
      setLoadingConvert(false);
    }
  };

  return {
    orders,
    loading,
    error,
    loadingConvert,
    loadOrders,
    handleCreateOrder,
    handleDelete,
    handleConvertToSale,
  };
}
