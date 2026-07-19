import { useState } from "react";

import {
  getDelivery,
  createDelivery,
  updateDelivery,
  changeDeliveryStatus,
  completeDelivery,
} from "../services/delivery.service";

export function useDeliveries() {
  const [delivery, setDelivery] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  async function loadDelivery(orderId: string) {
    setLoading(true);

    try {
      const data = await getDelivery(orderId);

      setDelivery(data);
    } finally {
      setLoading(false);
    }
  }

  async function saveDelivery(orderId: string, data: any) {
    const result = await createDelivery(orderId, data);

    setDelivery(result);
  }

  async function update(orderId: string, data: any) {
    const result = await updateDelivery(orderId, data);

    setDelivery(result);
  }

  async function changeStatus(orderId: string, status: string) {
    const result = await changeDeliveryStatus(orderId, status);

    setDelivery(result);
  }

  async function complete(orderId: string) {
    const result = await completeDelivery(orderId);

    setDelivery(result);
  }

  return {
    delivery,
    loading,
    loadDelivery,
    saveDelivery,
    update,
    changeStatus,
    complete,
  };
}
