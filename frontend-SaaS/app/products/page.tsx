import { InventoryTable } from "@/features/inventory/components/InventoryTable";
import ProductTable from "@/features/products/components/ProductTable";

export default function InventoryPage() {
  return (
    <main className="p-6">
      <section>
        <div>
          <h1 className="text-5xl font-bold mb-2">Productos</h1>
          <p className="text-lg text-stone-500">
            Gestiona los productos de tu panadería.
          </p>
        </div>
      </section>
      <ProductTable />
    </main>
  );
}
