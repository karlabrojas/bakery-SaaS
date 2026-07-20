"use client";

import { OrdersTable } from "@/features/orders/components/OrdersTable";

export default function OrdersPage() {
  return (
    <main className="p-6 md:px-10 w-full mx-auto space-y-6">
      <OrdersTable />
    </main>
  );
}
