import { OrdersTable } from "@/features/orders/components/OrdersTable";

export default function OrdersPage() {
  return (
    <main className="p-6">
      <section className="flex flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold mb-2">Pedidos</h1>
          <p className="text-lg text-stone-500">
            Gestiona los pedidos de tu panadería.
          </p>
        </div>
      </section>
      <OrdersTable />
    </main>
  );
}