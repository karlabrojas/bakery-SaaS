"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface ItemCarrito {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function PaginaCarrito() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productos: ItemCarrito[] = useMemo(() => {
    const datos = searchParams.get("items");
    if (!datos) return [];
    try {
      return JSON.parse(decodeURIComponent(datos));
    } catch {
      return [];
    }
  }, [searchParams]);

  const total = productos.reduce(
    (suma, producto) => suma + producto.price * producto.quantity,
    0,
  );

  const irAPago = () => {
    const itemsCodificados = encodeURIComponent(JSON.stringify(productos));
    router.push(`/sales/payment?total=${total}&items=${itemsCodificados}`);
  };

  if (productos.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No hay productos seleccionados.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 bg-[#472D20] text-white p-4">
        Resumen de venta
      </h2>

      <div className="space-y-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="flex justify-between items-center bg-white border rounded-lg p-3"
          >
            <div>
              <p className="font-semibold">{producto.name}</p>
              <p className="text-sm text-gray-500">
                {producto.quantity} x ${producto.price}
              </p>
            </div>
            <p className="font-bold">${producto.price * producto.quantity}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 text-lg font-bold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <div className="mt-6">
        <Button className="w-full" onClick={irAPago}>
          Continuar al pago
        </Button>
      </div>
    </div>
  );
}