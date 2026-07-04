// app/inventory/page.tsx

import { InventoryTable } from "@/features/inventory/components/InventoryTable";


export default function InventoryPage() {
    return (
        <main className="p-6">
            <section >
                <div>
                    <h1 className="text-5xl font-bold mb-2">Inventario</h1>
                    <p className="text-lg text-stone-500">
                        Gestiona los productos de tu panadería.
                    </p>
                </div>
            </section>
            <InventoryTable />
        </main>
    );
}