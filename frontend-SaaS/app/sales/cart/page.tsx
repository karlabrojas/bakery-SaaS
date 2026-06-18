"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/features/sales/store/useCartStore";

export default function PaginaCarrito() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const total = useCartStore((state) => state.total());

  if (!items.length) {
    return (
      <div className="p-6 text-center">No hay productos seleccionados.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 bg-[#472D20] text-white p-4">
        Resumen de venta
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border rounded-lg p-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>

              <p>
                {item.quantity} x ${item.price}
              </p>
            </div>

            <p>${item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 font-bold">
        <span>Total</span>

        <span>${total}</span>
      </div>

      <Button
        className="w-full mt-4"
        onClick={() => router.push("/sales/payment")}
      >
        Continuar al pago
      </Button>
    </div>
  );
}
