import { IngredientTable } from "@/features/inventory/components/IngredientTable";

export default function InventoryPage() {
    return (
        <main className="p-6">
            <section className="mb-8">
                <h1 className="text-5xl font-bold mb-2">Inventario</h1>
                <p className="text-lg text-stone-500">
                    Gestiona los ingredientes de tu panadería.
                </p>
            </section>

            <IngredientTable />
        </main>
    );
}