"use client";

import { useState } from "react";
import { Tag, ChevronDown, Edit, Trash2, Power, PowerOff } from "lucide-react";

import { useProducts } from "@/features/products/hooks/useProducts";
import { Product } from "@/features/products/types/product.type";

import AddProductModal from "@/features/products/components/AddProductModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";

export default function InventoryTable() {
  const {
    products,
    loading,
    error,
    loadProducts,
    handleDelete,
    handleActivate,
    handleDeactivate,
  } = useProducts();

  const [editando, setEditando] = useState<Product | null>(null);
  const [modalAgregar, setModalAgregar] = useState(false);

  const [eliminando, setEliminando] = useState<Product | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [activando, setActivando] = useState<Product | null>(null);
  const [desactivando, setDesactivando] = useState<Product | null>(null);
  const [loadingActivar, setLoadingActivar] = useState(false);
  const [loadingDesactivar, setLoadingDesactivar] = useState(false);

  const productosFiltrados = products.filter((product) => {
    const coincideNombre = product.name
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria = categoriaSeleccionada
      ? product.category === categoriaSeleccionada
      : true;

    return coincideNombre && coincideCategoria;
  });

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return;
    setLoadingDelete(true);
    setErrorEliminar("");
    try {
      await handleDelete(eliminando.id);
      setEliminando(null);
      loadProducts();
    } catch (err: any) {
      if (err.tieneVentas) {
        setErrorEliminar(
          "No se puede eliminar este producto porque tiene historial de ventas. Puedes desactivarlo en su lugar.",
        );
      } else {
        setErrorEliminar(err.message);
      }
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleConfirmarDesactivar = async () => {
    if (!desactivando) return;
    setLoadingDesactivar(true);
    try {
      await handleDeactivate(desactivando.id);
      setDesactivando(null);
      loadProducts();
    } finally {
      setLoadingDesactivar(false);
    }
  };

  const handleConfirmarActivar = async () => {
    if (!activando) return;
    setLoadingActivar(true);
    try {
      await handleActivate(activando.id);
      setActivando(null);
      loadProducts();
    } finally {
      setLoadingActivar(false);
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={busqueda} onChange={setBusqueda} />
        </div>

        <div className="relative w-full sm:w-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Tag className="w-4 h-4 text-[#a8956e]" />
          </span>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="w-full sm:min-w-44 pl-10 pr-9 py-3.5 text-sm text-stone-700 bg-[#fdf6ec] border border-[#e8d5b7] rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-[#472D20] transition"
          >
            <option value="">Todas las categorías</option>
            <option value="pan_dulce">Pan dulce</option>
            <option value="pan_salado">Pan salado</option>
            <option value="pastel">Pastel</option>
            <option value="galleta">Galleta</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#a8956e]" />
          </span>
        </div>

        <div className="sm:ml-auto w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setModalAgregar(true)}
          >
            + Agregar producto
          </Button>
        </div>
      </div>

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
                className={`border-b border-stone-100 last:border-none transition-colors ${
                  product.is_active
                    ? "hover:bg-stone-50/50"
                    : "bg-red-50/30 hover:bg-red-50/50 opacity-70"
                }`}
              >
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
                  <div className="flex items-center gap-2">
                    {product.name}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] rounded-lg transition-colors border border-stone-200"
                      title="Editar"
                    >
                      <Edit size={14} />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => setEliminando(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
                    </button>

                    <button
                      onClick={() =>
                        product.is_active
                          ? setDesactivando(product)
                          : setActivando(product)
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                        product.is_active
                          ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      }`}
                      title={product.is_active ? "Desactivar" : "Activar"}
                    >
                      {product.is_active ? (
                        <PowerOff size={14} />
                      ) : (
                        <Power size={14} />
                      )}
                      <span>
                        {product.is_active ? "Desactivar" : "Activar"}
                      </span>
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
        errorMessage={errorEliminar}
        onClose={() => {
          setEliminando(null);
          setErrorEliminar("");
        }}
        onConfirm={handleConfirmarEliminar}
      />

      <ConfirmModal
        isOpen={!!desactivando}
        title="Desactivar producto"
        message={`¿Desea desactivar "${desactivando?.name}"? Ya no aparecerá en el catálogo de ventas.`}
        confirmText="Desactivar"
        loading={loadingDesactivar}
        variant="danger"
        onClose={() => setDesactivando(null)}
        onConfirm={handleConfirmarDesactivar}
      />

      <ConfirmModal
        isOpen={!!activando}
        title="Activar producto"
        message={`¿Desea activar "${activando?.name}"? Volverá a aparecer en el catálogo.`}
        confirmText="Activar"
        loading={loadingActivar}
        variant="primary"
        onClose={() => setActivando(null)}
        onConfirm={handleConfirmarActivar}
      />
    </>
  );
}
