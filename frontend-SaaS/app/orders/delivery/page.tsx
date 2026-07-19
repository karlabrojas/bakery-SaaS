"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeliveries } from "@/features/orders/hooks/useDeliveries";
import DeliveryCard from "@/features/orders/components/Delivery/DeliveryCard";
import DeliveryTimeline from "@/features/orders/components/Delivery/DeliveryTimeline";
import DeliveryModal from "@/features/orders/components/Delivery/DeliveryModal";
import Button from "@/components/ui/Button";

export default function DeliveryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const {
    delivery,
    loading,
    error,
    loadDelivery,
    saveDelivery,
    update,
    complete,
  } = useDeliveries();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadDelivery(orderId);
    }
  }, [orderId]);

  if (!orderId) {
    return (
      <main className="p-6 text-center">
        <p className="text-red-500 font-semibold mb-4">
          No se proporcionó un ID de pedido válido.
        </p>
        <Button onClick={() => router.push("/orders")}>Volver a Pedidos</Button>
      </main>
    );
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (delivery) {
        await update(orderId, formData);
      } else {
        await saveDelivery(orderId, formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <button
            onClick={() => router.push("/orders")}
            className="text-sm text-stone-500 hover:underline mb-2 block"
          >
            ← Volver a Pedidos
          </button>
          <h1 className="text-4xl font-bold text-[#472D20]">
            Logística de Entrega
          </h1>
        </div>

        {!delivery && !loading && (
          <Button onClick={() => setIsModalOpen(true)}>Programar Envío</Button>
        )}
      </section>

      {loading && (
        <p className="text-stone-500 animate-pulse">
          Cargando información logístico...
        </p>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !delivery && !error && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-stone-500">
          Este pedido no cuenta con una entrega programada aún.
        </div>
      )}

      {delivery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DeliveryCard
              delivery={delivery}
              onEdit={() => setIsModalOpen(true)}
              onComplete={() => complete(orderId)}
            />
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 h-fit">
            <h3 className="text-lg font-bold text-[#472D20] mb-4">Progreso</h3>
            <DeliveryTimeline status={delivery.status} />
          </div>
        </div>
      )}

      <DeliveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        delivery={delivery}
        loading={loading}
      />
    </main>
  );
}
