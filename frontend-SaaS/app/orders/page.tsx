"use client";

import { OrdersTable } from "@/features/orders/components/OrdersTable";

export default function OrdersPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-[#EAD9B6] pb-6 mb-4">
        <div>
          <h1 className="text-5xl font-bold text-[#472D20] mb-2">Pedidos</h1>
          <p className="text-lg text-[#5A2E1F]">
            Gestiona los pedidos y el estado de producción de tu panadería.
          </p>
        </div>
      </section>

      {/* Renderizado de la tabla autónoma */}
      <OrdersTable />
    </main>
  );
}
