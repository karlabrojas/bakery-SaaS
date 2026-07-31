import { Truck } from "lucide-react";
import { TodayDelivery } from "../types/dashboard.type";

interface Props {
  deliveries: TodayDelivery[];
}

export default function TodayDeliveries({ deliveries }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <Truck className="text-orange-500" />

        <h2 className="font-semibold">Entregas de hoy</h2>
      </div>

      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="border-b pb-3">
            <p className="font-medium">{delivery.recipientName}</p>

            <p className="text-sm text-gray-500">{delivery.address}</p>

            <p className="text-sm">
              {new Date(delivery.estimatedDelivery).toLocaleTimeString(
                "es-MX",
                {
                  hour: "2-digit",

                  minute: "2-digit",
                },
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
