import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Delivery } from "../../types/delivery.type";
import DeliveryStatusBadge from "./DeliveryStatusBagde";

interface DeliveryCardProps {
  delivery: Delivery;
  onComplete: () => void;
  onEdit: () => void;
}

export default function DeliveryCard({
  delivery,
  onComplete,
  onEdit,
}: DeliveryCardProps) {
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "No asignada";
    return new Date(dateStr).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    // Se fuerza rounded-2xl, fondo blanco e hilos de la app
    <Card className="bg-white p-6 rounded-2xl border border-[#EAD9B6]/40 shadow-sm space-y-5">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <h3 className="text-xl font-bold text-[#472D20] flex items-center gap-2">
          <span>🚚</span> Detalles de Entrega
        </h3>
        {/* Usamos el badge estilizado dinámico */}
        <DeliveryStatusBadge status={delivery.status} />
      </div>

      <div className="space-y-3 text-stone-700 text-sm md:text-base">
        <p>
          <strong className="text-[#472D20]">Destinatario:</strong>{" "}
          {delivery.recipient_name}
        </p>
        <p>
          <strong className="text-[#472D20]">Teléfono:</strong>{" "}
          {delivery.recipient_phone}
        </p>
        <p>
          <strong className="text-[#472D20]">Dirección:</strong>{" "}
          {delivery.address}
        </p>
        <p>
          <strong className="text-[#472D20]">Entrega Estimada:</strong>{" "}
          <span className="bg-[#FAF6E9] px-2 py-0.5 rounded text-[#472D20] font-medium text-sm">
            {formatDateTime(delivery.estimated_delivery)}
          </span>
        </p>
        {delivery.delivery_at && (
          <p>
            <strong className="text-[#472D20]">Entregado el:</strong>{" "}
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium text-sm">
              {formatDateTime(delivery.delivery_at)}
            </span>
          </p>
        )}
        {delivery.notes && (
          <div className="bg-[#FAF6E9]/60 p-3 rounded-xl border border-[#EAD9B6]/30 mt-2">
            <strong className="text-[#472D20] block text-xs uppercase tracking-wider mb-1">
              Notas del envío:
            </strong>
            <p className="text-stone-600 italic text-sm">{delivery.notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-[#EAD9B6] text-[#472D20] hover:bg-[#FAF6E9] transition-colors rounded-xl text-sm font-medium"
        >
          Editar
        </button>
        {delivery.status !== "DELIVERED" && (
          <Button variant="primary" onClick={onComplete}>
            Completar Entrega
          </Button>
        )}
      </div>
    </Card>
  );
}
