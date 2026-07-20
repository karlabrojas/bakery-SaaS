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
      <main className="min-h-screen bg-[#FAF6E9] p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAD9B6]/60 text-center max-w-md">
          <p className="text-red-500 font-semibold mb-4">
            No se proporcionó un ID de pedido válido.
          </p>
          <Button onClick={() => router.push("/orders")}>
            Volver a Pedidos
          </Button>
        </div>
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
    // Se añade min-h-screen y el color de fondo crema de la app
    <main className="min-h-screen bg-[#FAF6E9] p-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push("/orders")}
              className="text-sm text-stone-500 hover:text-[#472D20] transition-colors mb-2 block"
            >
              ← Volver a Pedidos
            </button>
            <h1 className="text-4xl font-bold text-[#472D20]">
              Logística de Entrega
            </h1>
          </div>

          {!delivery && !loading && (
            <Button onClick={() => setIsModalOpen(true)}>
              Programar Envío
            </Button>
          )}
        </section>

        {loading && (
          <p className="text-[#472D20] font-medium animate-pulse">
            Cargando información logística...
          </p>
        )}

        {error && (
          <p className="text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-200">
            Error: {error}
          </p>
        )}

        {!loading && !delivery && !error && (
          <div className="bg-white border border-[#EAD9B6]/50 rounded-2xl p-12 text-center text-stone-500 shadow-sm">
            <span className="text-4xl block mb-3">📦</span>
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
            <div className="bg-white p-6 rounded-2xl border border-[#EAD9B6]/40 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-[#472D20] mb-4">
                Progreso
              </h3>
              <DeliveryTimeline status={delivery.status} />
            </div>
          </div>
        )}
      </div>

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
