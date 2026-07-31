"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <button
        onClick={() => router.push("/sales")}
        className="bg-orange-500 text-white rounded-lg p-4"
      >
        Nueva venta
      </button>

      <button
        onClick={() => router.push("/orders")}
        className="bg-blue-500 text-white rounded-lg p-4"
      >
        Nuevo pedido
      </button>

      <button
        onClick={() => router.push("/products")}
        className="bg-green-500 text-white rounded-lg p-4"
      >
        Productos
      </button>

      <button
        onClick={() => router.push("/customers")}
        className="bg-purple-500 text-white rounded-lg p-4"
      >
        Clientes
      </button>
    </div>
  );
}
