import { Truck } from "lucide-react";
import { TodayDelivery } from "../types/dashboard.type";

interface Props {
  deliveries: TodayDelivery[];
}

export default function TodayDeliveries({ deliveries }: Props) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#B8926B] shadow-md p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Truck className="text-[#472D20]" size={22} />
        <h2 className="font-bold text-lg text-[#472D20]">Entregas de hoy</h2>
      </div>

      {deliveries.length === 0 ? (
        <p className="text-sm text-[#8C6D53] italic py-2">
          No tienes entregas programadas para hoy.
        </p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="border-b border-[#EAD9B6] pb-3 last:border-0 last:pb-0"
            >
              <p className="font-bold text-[#472D20]">
                {delivery.recipientName}
              </p>
              <p className="text-sm text-[#5A2E1F] mt-0.5">
                {delivery.address}
              </p>
              <p className="text-xs font-semibold text-[#8C6D53] mt-1 bg-[#FBEACE] inline-block px-2 py-0.5 rounded border border-[#B8926B]">
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
      )}
    </div>
  );
}
