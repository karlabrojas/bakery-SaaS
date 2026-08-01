import { AlertTriangle } from "lucide-react";
import { InventoryAlert } from "../types/dashboard.type";

interface Props {
  items: InventoryAlert[];
}

export default function LowStockCard({ items }: Props) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#B8926B] shadow-md p-6">
      <div className="flex gap-2.5 items-center mb-5">
        <AlertTriangle className="text-[#A83232]" size={22} />
        <h2 className="font-bold text-lg text-[#472D20]">Stock bajo</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[#8C6D53] italic py-2">
          Todo en orden. No hay productos con stock bajo.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm border-b border-[#EAD9B6] pb-2 last:border-0 last:pb-0"
            >
              <span className="font-medium text-[#5A2E1F]">{item.name}</span>
              <span className="font-bold text-[#A83232] bg-[#FBEACE] px-2.5 py-1 rounded-md border border-[#B8926B]">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
