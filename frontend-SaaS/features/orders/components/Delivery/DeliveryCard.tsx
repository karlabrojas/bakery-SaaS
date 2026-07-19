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
  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#472D20]">🚚 Entrega</h3>

        <span
          className="
                px-3
                py-1
                rounded-full
                bg-[#EAD9B6]
                text-[#472D20]
                font-semibold
                "
        >
          {delivery.status}
        </span>
      </div>

      <div className="space-y-2 text-[#5A2E1F]">
        <p>
          <strong>Fecha:</strong> {delivery.delivery_date}
        </p>

        <p>
          <strong>Hora:</strong> {delivery.delivery_time}
        </p>

        <p>
          <strong>Dirección:</strong> {delivery.address}
        </p>

        {delivery.reference && (
          <p>
            <strong>Referencia:</strong> {delivery.reference}
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

        <Button variant="primary" onClick={onComplete}>
          Completar
        </Button>
      </div>
    </Card>
  );
}
