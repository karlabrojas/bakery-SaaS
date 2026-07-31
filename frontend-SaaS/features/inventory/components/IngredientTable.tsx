"use client";

import { useState } from "react";
import { useIngredientes } from "../hooks/useIngredients";
import { Ingredient } from "../types/inventory.type";
import IngredientModal from "./IngredientModal";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EntradaModal from "./EntradaModal";
import SalidaModal from "./SalidaModal";

export function IngredientTable() {
  const { ingredientes, cargando, error, cargarIngredientes, handleCrear, handleActualizar, handleEliminar, handleEntrada, handleSalida } = useIngredientes();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Ingredient | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [eliminando, setEliminando] = useState<Ingredient | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const [entrada, setEntrada] = useState<Ingredient | null>(null);

  const [salida, setSalida] = useState<Ingredient | null>(null);

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return;
    setLoadingEliminar(true);
    setErrorEliminar("");
    try {
      await handleEliminar(eliminando.id);
      setEliminando(null);
    } catch (err: any) {
      setErrorEliminar(err.message);
    } finally {
      setLoadingEliminar(false);
    }
  };

  const ingredientesFiltrados = ingredientes.filter((i) =>
    i.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return (
    <div className="py-12 flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-stone-500">Cargando ingredientes...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
      {error}
    </div>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={busqueda} onChange={setBusqueda} />
        </div>
        <div className="sm:ml-auto">
          <button
            onClick={() => { setEditando(null); setModalAbierto(true); }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#472D20] text-white text-sm font-bold rounded-xl hover:bg-[#5c3a2a] transition"
          >
            + Agregar Ingrediente
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-stone-100">
        <table className="w-full text-sm">
          <thead className="bg-[#472D20] text-white">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold">Stock disponible</th>
              <th className="text-left px-4 py-3 font-semibold">Stock mínimo</th>
              <th className="text-left px-4 py-3 font-semibold">Unidad de medida</th>
              <th className="text-left px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {ingredientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-stone-400">
                  {busqueda ? "No se encontraron ingredientes." : "No hay ingredientes registrados."}
                </td>
              </tr>
            ) : (
              ingredientesFiltrados.map((ingrediente) => (
                <tr key={ingrediente.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#472D20]">{ingrediente.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${ingrediente.quantity === 0 ? "text-red-500" : "text-stone-800"}`}>
                      {ingrediente.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${ingrediente.quantity <= ingrediente.minimum_stock
                      ? "text-red-500"
                      : "text-stone-800"
                      }`}>
                      {ingrediente.minimum_stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium">
                      {ingrediente.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setEditando(ingrediente); setModalAbierto(true); }}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] rounded-lg transition-colors border border-stone-200"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => setEliminando(ingrediente)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                    >
                      Eliminar
                    </button>

                    <button
                      onClick={() => setEntrada(ingrediente)}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
                    >
                      + Entrada
                    </button>

                    <button
                      onClick={() => setSalida(ingrediente)}
                      className="px-3 py-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors border border-orange-200"
                    >
                      - Salida
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <IngredientModal
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null); }}
        onSuccess={() => {
          setModalAbierto(false);
          setEditando(null);
          cargarIngredientes();
        }}
        ingrediente={editando}
        onCrear={handleCrear}
        onActualizar={handleActualizar}
      />

      <ConfirmModal
        isOpen={!!eliminando}
        title="Eliminar ingrediente"
        message={`¿Desea eliminar "${eliminando?.name}"?`}
        confirmText="Eliminar"
        loading={loadingEliminar}
        variant="danger"
        error={errorEliminar}
        onClose={() => { setEliminando(null); setErrorEliminar(""); }}
        onConfirm={handleConfirmarEliminar}
      />

      <EntradaModal
        isOpen={!!entrada}
        onClose={() => setEntrada(null)}
        onSuccess={cargarIngredientes}
        ingrediente={entrada}
        onEntrada={handleEntrada}
      />

      <SalidaModal
        isOpen={!!salida}
        onClose={() => setSalida(null)}
        onSuccess={cargarIngredientes}
        ingrediente={salida}
        onSalida={handleSalida}
      />
    </>
  );
}