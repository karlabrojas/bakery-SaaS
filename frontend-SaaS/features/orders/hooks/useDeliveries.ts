import { useState } from "react";
import { Delivery } from "../types/delivery.type";
import {
  getDelivery,
  createDelivery,
  updateDelivery,
  changeDeliveryStatus,
  completeDelivery,
} from "../services/delivery.service";

/**
 * Normaliza el objeto devuelto por Supabase para que sea compatible
 * con componentes tanto en camelCase como en snake_case de forma segura.
 */
function normalizeDeliveryData(data: any): Delivery | null {
  if (!data) return null;
  return {
    ...data,
    // Aseguramos compatibilidad bidireccional de campos clave
    deliveryType: data.delivery_type || data.deliveryType,
    recipientName: data.recipient_name || data.recipientName,
    recipientPhone: data.recipient_phone || data.recipientPhone,
    estimatedDelivery: data.estimated_delivery || data.estimatedDelivery,
  };
}

export function useDeliveries() {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDelivery(orderId: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getDelivery(orderId);
      setDelivery(normalizeDeliveryData(data));
    } catch (err: any) {
      setError(err.message || "Error al obtener la entrega");
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  }

  async function saveDelivery(orderId: string, data: Partial<Delivery>) {
    setLoading(true);
    setError(null);
    try {
      const result = await createDelivery(orderId, data);
      setDelivery(normalizeDeliveryData(result));
      return result;
    } catch (err: any) {
      setError(err.message || "Error al guardar la entrega");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function update(orderId: string, data: Partial<Delivery>) {
    setLoading(true);
    setError(null);
    try {
      const result = await updateDelivery(orderId, data);
      setDelivery(normalizeDeliveryData(result));
      return result;
    } catch (err: any) {
      setError(err.message || "Error al actualizar la entrega");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(orderId: string, status: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await changeDeliveryStatus(orderId, status);
      setDelivery(normalizeDeliveryData(result));
      return result;
    } catch (err: any) {
      setError(err.message || "Error al cambiar el estado");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function complete(orderId: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await completeDelivery(orderId);
      setDelivery(normalizeDeliveryData(result));
      return result;
    } catch (err: any) {
      setError(err.message || "Error al completar la entrega");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    delivery,
    loading,
    error,
    loadDelivery,
    saveDelivery,
    update,
    changeStatus,
    complete,
  };
}
