import { AlertTriangle } from "lucide-react";
import { InventoryAlert } from "../types/dashboard.type";

interface Props {
  items: InventoryAlert[];
}

export default function LowStockCard({ items }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex gap-2 items-center mb-5">
        <AlertTriangle className="text-red-500" />

        <h2 className="font-semibold">Stock bajo</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>

            <span>
              {item.quantity} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
