"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Product } from "@/features/products/types/product.type";
import AddProductModal from "@/features/products/components/AddProductModal";
import ConfirmDeleteModal from "@/features/sales/components/ConfirmDeleteModal";

export function InventoryTable() {
  const { products, loading, error, handleUpdate, loadProducts, handleDelete } = useProducts();
  const [editando, setEditando] = useState<Product | null>(null);
  const [errorModal, setErrorModal] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [eliminando, setEliminando] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);


  const handleGuardarEdicion = async () => {
    if (!editando) return;
    setGuardando(true);
    setErrorModal("");
    try {
      await handleUpdate(editando.id, {
        name: editando.name,
        description: editando.description,
        price: editando.price,
        category: editando.category,
      });
      setEditando(null);
    } catch (err: any) {
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return;
    setLoadingDelete(true);
    try {
      await handleDelete(eliminando.id);
      setEliminando(null);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (loading) return (
    <div className="py-12 flex flex-col items-center justify-center space-y-2">
      <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium text-stone-500">Cargando productos...</p>
    </div>
  );

  if (error) return (
    <p className="text-red-500 text-center">{error}</p>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalAgregar(true)}
          className="px-5 py-2.5 bg-[#472D20] text-white text-sm font-bold rounded-xl hover:bg-[#5c3a2a] transition"
        >
          + Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#472D20] text-white">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold">Descripción</th>
              <th className="text-left px-4 py-3 font-semibold">Precio</th>
              <th className="text-left px-4 py-3 font-semibold">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-stone-400">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-stone-500">{product.description}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{product.category.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => { setEditando(product) }}
                      className="px-3 py-1.5 text-xs font-bold bg-[#FBEACE] text-[#472D20] rounded-lg hover:bg-[#f0d9a8] transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setEliminando(product)}
                      className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      <ConfirmDeleteModal
        open={!!eliminando}
        title="Eliminar producto"
        message={`¿Estás seguro que deseas eliminar "${eliminando?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={loadingDelete}
        onCancel={() => setEliminando(null)}
        onConfirm={handleConfirmarEliminar}
      />
    </>
  );
}