"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeliveries } from "@/features/orders/hooks/useDeliveries";
import DeliveryCard from "@/features/orders/components/Delivery/DeliveryCard";
import DeliveryTimeline from "@/features/orders/components/Delivery/DeliveryTimeline";
import DeliveryModal from "@/features/orders/components/Delivery/DeliveryModal";
import Button from "@/components/ui/Button";
import { ArrowLeft, Loader2, AlertCircle, Truck } from "lucide-react";

export default function DeliveryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const { delivery, loading, error, loadDelivery, update, complete } =
    useDeliveries();
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
      await update(orderId, formData);
      await loadDelivery(orderId);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al actualizar la entrega:", err);
    }
  };

  return (
    <main className="min-h-screen  p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="inline-flex items-center gap-2.5 text-base font-bold text-[#472D20] bg-white border border-[#EFE9DD] px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#FAF6E9] transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" /> Volver a Pedidos
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#472D20] flex items-center justify-center text-white shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#472D20]">
                Logística de Entrega
              </h1>
              <p className="text-sm text-stone-500 mt-0.5">
                Supervisa y gestiona los detalles del envío o recolección.
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#472D20]" />
            <span className="ml-3 text-[#472D20] font-medium">
              Cargando información logística...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Error: {error}</span>
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
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EFE9DD] shadow-sm h-fit">
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
