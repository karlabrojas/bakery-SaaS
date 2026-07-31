"use client";

import { useState } from "react";
import { useIngredientes } from "../hooks/useIngredients";
import { Ingredient } from "../types/inventory.type";
import IngredientModal from "./IngredientModal";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EntradaModal from "./EntradaModal";
import SalidaModal from "./SalidaModal";
import IngredientDetailModal from "./IngredientDetailModal";
import AjusteModal from "./AjusteModal";
import { Pencil, Trash2, Plus, Minus, Eye, SlidersHorizontal } from "lucide-react";

export function IngredientTable() {
  const { ingredientes, cargando, error, cargarIngredientes, handleCrear, handleActualizar, handleEliminar, handleEntrada, handleSalida, handleAjuste } = useIngredientes();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Ingredient | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [eliminando, setEliminando] = useState<Ingredient | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const [entrada, setEntrada] = useState<Ingredient | null>(null);

  const [salida, setSalida] = useState<Ingredient | null>(null);

  const [viendo, setViendo] = useState<Ingredient | null>(null);

  const [ajustando, setAjustando] = useState<Ingredient | null>(null);

  const [soloStockBajo, setSoloStockBajo] = useState(false);

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

  const getEstadoStock = (quantity: number, minimum_stock: number) => {
    if (quantity === 0) return { label: "Sin stock", className: "bg-red-100 text-red-700" };
    if (quantity <= minimum_stock) return { label: "Stock bajo", className: "bg-yellow-100 text-yellow-700" };
    return { label: "En stock", className: "bg-green-100 text-green-700" };
  };
  const getColorStock = (quantity: number, minimum_stock: number) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= minimum_stock) return "text-amber-600";
    return "text-green-600";
  };

  const ingredientesFiltrados = ingredientes.filter((i) => {
    const coincideNombre = i.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideStock = soloStockBajo ? i.quantity <= i.minimum_stock : true;
    return coincideNombre && coincideStock;
  });

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
        <button
          onClick={() => setSoloStockBajo(!soloStockBajo)}
          className={`px-4 py-2.5 text-sm font-bold rounded-xl border transition ${soloStockBajo
              ? "bg-red-500 text-white border-red-500"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            }`}
        >
          ⚠️ Stock bajo
        </button>
        <div className="sm:ml-auto">
          <button
            onClick={() => { setEditando(null); setModalAbierto(true); }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#472D20] text-white text-sm font-bold rounded-xl hover:bg-[#5c3a2a] transition"
          >
            + Agregar Ingrediente
          </button>
        </div>
      </div>

      {ingredientesFiltrados.length === 0 ? (
        <p className="text-center py-12 text-stone-400">
          {busqueda ? "No se encontraron ingredientes." : "No hay ingredientes registrados."}
        </p>
      ) : (
        <>

          <div className="flex flex-col gap-3 md:hidden">
            {ingredientesFiltrados.map((ingrediente) => {
              const estado = getEstadoStock(ingrediente.quantity, ingrediente.minimum_stock);
              const colorStock = getColorStock(ingrediente.quantity, ingrediente.minimum_stock);

              return (
                <div key={ingrediente.id} className="bg-white rounded-2xl border border-[#f0e6d3] shadow-sm p-4 space-y-3">


                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#472D20] text-base">{ingrediente.name}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estado.className}`}>
                      {estado.label}
                    </span>
                  </div>


                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#fdf8f3] rounded-xl py-2">
                      <p className="text-xs text-stone-500 mb-0.5">Disponible</p>
                      <p className={`font-bold text-lg ${colorStock}`}>{ingrediente.quantity}</p>
                    </div>
                    <div className="bg-[#fdf8f3] rounded-xl py-2">
                      <p className="text-xs text-stone-500 mb-0.5">Mínimo</p>
                      <p className="font-bold text-lg text-stone-600">{ingrediente.minimum_stock}</p>
                    </div>
                    <div className="bg-[#fdf8f3] rounded-xl py-2">
                      <p className="text-xs text-stone-500 mb-0.5">Unidad</p>
                      <p className="font-bold text-sm text-[#6B3118]">{ingrediente.unit}</p>
                    </div>
                  </div>


                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button onClick={() => { setEditando(ingrediente); setModalAbierto(true); }}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] border border-stone-200 text-xs font-semibold transition">
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => setEntrada(ingrediente)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition">
                      <Plus size={12} /> Entrada
                    </button>
                    <button onClick={() => setSalida(ingrediente)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold transition">
                      <Minus size={12} /> Salida
                    </button>
                    <button onClick={() => setViendo(ingrediente)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FBEACE] hover:bg-[#f0d9a8] text-[#472D20] border border-[#e0cdb8] text-xs font-semibold transition">
                      <Eye size={12} /> Detalle
                    </button>
                    <button onClick={() => setAjustando(ingrediente)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition">
                      <SlidersHorizontal size={12} /> Ajuste
                    </button>
                    <button onClick={() => setEliminando(ingrediente)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition">
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* diseño para computadoras */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-[#f0e6d3] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#472D20] text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Ingrediente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Stock disponible</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Stock mínimo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Unidad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingredientesFiltrados.map((ingrediente) => {
                  const estado = getEstadoStock(ingrediente.quantity, ingrediente.minimum_stock);
                  const colorStock = getColorStock(ingrediente.quantity, ingrediente.minimum_stock);

                  return (
                    <tr key={ingrediente.id} className="border-b border-[#f5ede3] last:border-none hover:bg-[#fdf8f3] transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#472D20]">{ingrediente.name}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-base ${colorStock}`}>{ingrediente.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 font-medium">{ingrediente.minimum_stock}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-[#f0e6d3] text-[#6B3118] rounded-full text-xs font-semibold">
                          {ingrediente.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estado.className}`}>
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button title="Editar" onClick={() => { setEditando(ingrediente); setModalAbierto(true); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] border border-stone-200 transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button title="Eliminar" onClick={() => setEliminando(ingrediente)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors">
                            <Trash2 size={13} />
                          </button>
                          <div className="w-px h-5 bg-stone-200 mx-0.5" />
                          <button title="Entrada" onClick={() => setEntrada(ingrediente)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors">
                            <Plus size={13} />
                          </button>
                          <button title="Salida" onClick={() => setSalida(ingrediente)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors">
                            <Minus size={13} />
                          </button>
                          <div className="w-px h-5 bg-stone-200 mx-0.5" />
                          <button title="Ver detalle" onClick={() => setViendo(ingrediente)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FBEACE] hover:bg-[#f0d9a8] text-[#472D20] border border-[#e0cdb8] transition-colors">
                            <Eye size={13} />
                          </button>
                          <button title="Ajuste" onClick={() => setAjustando(ingrediente)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors">
                            <SlidersHorizontal size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

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

      <IngredientDetailModal
        isOpen={!!viendo}
        onClose={() => setViendo(null)}
        ingrediente={viendo}
      />

      <AjusteModal
        isOpen={!!ajustando}
        onClose={() => setAjustando(null)}
        onSuccess={cargarIngredientes}
        ingrediente={ajustando}
        onAjuste={handleAjuste}
      />
    </>
  );
}