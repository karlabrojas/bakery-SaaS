"use client";

import Button from "@/components/ui/Button";
import { CartItem } from "../types/cart.type";
import { useRouter } from "next/navigation";

interface Props {
  items: CartItem[];
  total: number;
}

export default function Cart({ items, total }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#B8926B]/20 overflow-hidden max-w-md w-full">
      <div className="bg-[#472D20] p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Carrito de Compras
        </h2>
        <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold">
          {items.reduce((acc, curr) => acc + curr.quantity, 0)} productos
        </span>
      </div>

      <div className="p-4 space-y-2 max-h-[320px] overflow-y-auto bg-[#FAF6F0]">
        {items.length === 0 ? (
          <p className="text-center py-8 text-stone-400 text-sm">
            El carrito está vacío
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-[#FBEACE] px-4 py-3 rounded-lg border border-[#B8926B]/40 shadow-sm transition-all hover:border-[#B8926B]"
            >
              <span className="font-semibold text-[#472D20] text-sm">
                {item.name}
              </span>
              <span className="bg-[#472D20]/10 text-[#472D20] font-mono text-xs px-2 py-0.5 rounded-md font-bold">
                x{item.quantity}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-stone-100 space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
            Total estimado:
          </span>
          <span className="text-2xl font-black text-[#472D20] font-mono">
            ${total}
          </span>
        </div>

        <Button
          className="w-full h-11 text-base font-semibold shadow-md active:scale-[0.99] transition-transform"
          onClick={() => router.push("/sales/payment")}
          disabled={items.length === 0}
        >
          Proceder al pago
        </Button>
      </div>
    </div>
  );
}
