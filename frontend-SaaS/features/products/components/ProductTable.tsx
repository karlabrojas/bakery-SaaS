"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { useProducts } from "@/features/products/hooks/useProducts";
import { Product } from "@/features/products/types/product.type";

import AddProductModal from "@/features/products/components/AddProductModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";

export default function InventoryTable() {
  const { products, loading, error, loadProducts, handleDelete } =
    useProducts();

  const [editando, setEditando] = useState<Product | null>(null);
  const [modalAgregar, setModalAgregar] = useState(false);

  const [eliminando, setEliminando] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = products.filter((product) =>
    product.name.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return;

    setLoadingDelete(true);

    try {
      await handleDelete(eliminando.id);

      setEliminando(null);

      loadProducts();
    } finally {
      setLoadingDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />

        <p className="text-sm text-stone-500">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-72">
          <SearchInput value={busqueda} onChange={setBusqueda} />
        </div>

        <Button onClick={() => setModalAgregar(true)}>
          + Agregar producto
        </Button>
      </div>

      {/* Tabla */}

      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-stone-100">
        <Table
          headers={[
            "Imagen",
            "Nombre",
            "Descripción",
            "Precio",
            "Categoría",
            "Acciones",
          ]}
        >
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-stone-400">
                {busqueda
                  ? "No se encontraron productos."
                  : "No hay productos registrados."}
              </td>
            </tr>
          ) : (
            productosFiltrados.map((product) => (
              <tr
                key={product.id}
                className="border-b border-stone-100 last:border-none hover:bg-stone-50/50 transition-colors"
              >
                {/* Imagen */}

                <td className="px-4 py-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 font-semibold text-[#472D20]">
                  {product.name}
                </td>

                <td className="px-4 py-3 text-stone-600 max-w-sm truncate">
                  {product.description}
                </td>

                <td className="px-4 py-3 font-bold text-stone-900">
                  ${product.price.toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <span className="capitalize px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                    {product.category.replace(/_/g, " ")}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditando(product)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] rounded-lg transition-colors border border-stone-200"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => setEliminando(product)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      </div>

      <AddProductModal
        isOpen={modalAgregar}
        onClose={() => setModalAgregar(false)}
        onSuccess={loadProducts}
      />

      <AddProductModal
        isOpen={!!editando}
        onClose={() => setEditando(null)}
        product={editando}
        onSuccess={loadProducts}
      />

      <ConfirmModal
        isOpen={!!eliminando}
        title="Eliminar producto"
        message={`¿Desea eliminar el producto "${eliminando?.name}"?`}
        confirmText="Eliminar"
        loading={loadingDelete}
        variant="danger"
        onClose={() => setEliminando(null)}
        onConfirm={handleConfirmarEliminar}
      />
    </>
  );
}
