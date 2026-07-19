import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Delivery } from "../../types/delivery.type";

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
  // Formatear la fecha estampa timestamptz de manera legible
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "No asignada";
    return new Date(dateStr).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#472D20]">
          🚚 Detalles de Entrega
        </h3>
        <span className="px-3 py-1 rounded-full bg-[#EAD9B6] text-[#472D20] font-semibold">
          {delivery.status}
        </span>
      </div>

      <div className="space-y-2 text-[#5A2E1F]">
        <p>
          <strong>Destinatario:</strong> {delivery.recipient_name}
        </p>
        <p>
          <strong>Teléfono:</strong> {delivery.recipient_phone}
        </p>
        <p>
          <strong>Dirección:</strong> {delivery.address}
        </p>
        <p>
          <strong>Entrega Estimada:</strong>{" "}
          {formatDateTime(delivery.estimated_delivery)}
        </p>
        {delivery.delivery_at && (
          <p>
            <strong>Entregado el:</strong>{" "}
            {formatDateTime(delivery.delivery_at)}
          </p>
        )}
        {delivery.notes && (
          <p>
            <strong>Notas:</strong> {delivery.notes}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-3">
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
        {delivery.status !== "DELIVERED" && (
          <Button variant="primary" onClick={onComplete}>
            Completar
          </Button>
        )}
      </div>
    </Card>
  );
}
