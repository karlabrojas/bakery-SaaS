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
import Table from "@/components/ui/Table";
import {
  Pencil,
  Trash2,
  Plus,
  Minus,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

export function IngredientTable() {
  const {
    ingredientes,
    cargando,
    error,
    cargarIngredientes,
    handleCrear,
    handleActualizar,
    handleEliminar,
    handleEntrada,
    handleSalida,
    handleAjuste,
  } = useIngredientes();

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
    if (quantity === 0)
      return { label: "Sin stock", className: "bg-red-100 text-red-700" };
    if (quantity <= minimum_stock)
      return {
        label: "Stock bajo",
        className: "bg-yellow-100 text-yellow-700",
      };
    return { label: "En stock", className: "bg-green-100 text-green-700" };
  };

  const getColorStock = (quantity: number, minimum_stock: number) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= minimum_stock) return "text-amber-600";
    return "text-green-600";
  };

  const ingredientesFiltrados = ingredientes.filter((i) => {
    const coincideNombre = i.name
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideStock = soloStockBajo ? i.quantity <= i.minimum_stock : true;
    return coincideNombre && coincideStock;
  });

  if (cargando)
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-500">Cargando ingredientes...</p>
      </div>
    );

  if (error)
    return (
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
          className={`px-4 py-2.5 text-sm font-bold rounded-xl border transition ${
            soloStockBajo
              ? "bg-red-500 text-white border-red-500"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          }`}
        >
          ⚠️ Stock bajo
        </button>
        <div className="sm:ml-auto">
          <button
            onClick={() => {
              setEditando(null);
              setModalAbierto(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#472D20] text-white text-sm font-bold rounded-xl hover:bg-[#5c3a2a] transition"
          >
            + Agregar Ingrediente
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {ingredientesFiltrados.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#FFF8E0] border-2 border-dashed border-[#B8926B]">
            <p className="text-sm font-semibold text-[#8C6D53]">
              {busqueda
                ? "No se encontraron ingredientes."
                : "No hay ingredientes registrados."}
            </p>
          </div>
        ) : (
          ingredientesFiltrados.map((ingrediente) => {
            const estado = getEstadoStock(
              ingrediente.quantity,
              ingrediente.minimum_stock,
            );
            const colorStock = getColorStock(
              ingrediente.quantity,
              ingrediente.minimum_stock,
            );

            return (
              <div
                key={ingrediente.id}
                className="bg-[#FFF8E0] rounded-2xl border-2 border-[#B8926B] shadow-sm p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#472D20] text-base">
                    {ingrediente.name}
                  </p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estado.className}`}
                  >
                    {estado.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#FBEACE] rounded-xl py-2 border border-[#B8926B]">
                    <p className="text-xs text-[#8C6D53] mb-0.5">Disponible</p>
                    <p className={`font-bold text-lg font-mono ${colorStock}`}>
                      {ingrediente.quantity}
                    </p>
                  </div>
                  <div className="bg-[#FBEACE] rounded-xl py-2 border border-[#B8926B]">
                    <p className="text-xs text-[#8C6D53] mb-0.5">Mínimo</p>
                    <p className="font-bold text-lg font-mono text-[#5A2E1F]">
                      {ingrediente.minimum_stock}
                    </p>
                  </div>
                  <div className="bg-[#FBEACE] rounded-xl py-2 border border-[#B8926B]">
                    <p className="text-xs text-[#8C6D53] mb-0.5">Unidad</p>
                    <p className="font-bold text-sm text-[#472D20]">
                      {ingrediente.unit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setEditando(ingrediente);
                      setModalAbierto(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#D9C3A9] text-xs font-semibold transition shadow-xs"
                  >
                    <Pencil size={12} className="text-[#8C6D53]" /> Editar
                  </button>
                  <button
                    onClick={() => setEntrada(ingrediente)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition shadow-xs"
                  >
                    <Plus size={12} /> Entrada
                  </button>
                  <button
                    onClick={() => setSalida(ingrediente)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold transition shadow-xs"
                  >
                    <Minus size={12} /> Salida
                  </button>
                  <button
                    onClick={() => setViendo(ingrediente)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FBEACE] hover:bg-[#EAD9B6] text-[#472D20] border border-[#B8926B] text-xs font-semibold transition shadow-xs"
                  >
                    <Eye size={12} className="text-[#8C6D53]" /> Detalle
                  </button>
                  <button
                    onClick={() => setAjustando(ingrediente)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition shadow-xs"
                  >
                    <SlidersHorizontal size={12} /> Ajuste
                  </button>
                  <button
                    onClick={() => setEliminando(ingrediente)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition shadow-xs"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden md:block overflow-hidden bg-[#FFF8E0] rounded-xl shadow-md border-2 border-[#B8926B]">
        <Table
          headers={[
            "Ingrediente",
            "Stock disponible",
            "Stock mínimo",
            "Unidad",
            "Estado",
            "Acciones",
          ]}
        >
          {ingredientesFiltrados.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-12 text-[#8C6D53] font-semibold bg-[#FFF8E0]"
              >
                {busqueda
                  ? "No se encontraron ingredientes."
                  : "No hay ingredientes registrados."}
              </td>
            </tr>
          ) : (
            ingredientesFiltrados.map((ingrediente) => {
              const estado = getEstadoStock(
                ingrediente.quantity,
                ingrediente.minimum_stock,
              );
              const colorStock = getColorStock(
                ingrediente.quantity,
                ingrediente.minimum_stock,
              );

              return (
                <tr
                  key={ingrediente.id}
                  className="border-b border-[#EAD9B6] last:border-none hover:bg-[#FBEACE]/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-[#472D20]">
                    {ingrediente.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold text-base font-mono ${colorStock}`}
                    >
                      {ingrediente.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#5A2E1F] font-medium font-mono">
                    {ingrediente.minimum_stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FBEACE] border border-[#B8926B] text-xs font-semibold text-[#472D20] capitalize">
                      {ingrediente.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estado.className}`}
                    >
                      {estado.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        title="Editar"
                        onClick={() => {
                          setEditando(ingrediente);
                          setModalAbierto(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 rounded-lg transition-colors border border-[#D9C3A9] shadow-xs"
                      >
                        <Pencil size={14} className="text-[#8C6D53]" />
                        <span>Editar</span>
                      </button>

                      <button
                        title="Eliminar"
                        onClick={() => setEliminando(ingrediente)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 shadow-xs"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>

                      <button
                        title="Entrada"
                        onClick={() => setEntrada(ingrediente)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 shadow-xs"
                      >
                        <Plus size={14} />
                        <span>Entrada</span>
                      </button>

                      <button
                        title="Salida"
                        onClick={() => setSalida(ingrediente)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors border border-orange-200 shadow-xs"
                      >
                        <Minus size={14} />
                        <span>Salida</span>
                      </button>

                      <button
                        title="Ver detalle"
                        onClick={() => setViendo(ingrediente)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#FBEACE] hover:bg-[#EAD9B6] text-[#472D20] border border-[#B8926B] rounded-lg transition-colors shadow-xs"
                      >
                        <Eye size={14} className="text-[#8C6D53]" />
                        <span>Detalle</span>
                      </button>

                      <button
                        title="Ajuste"
                        onClick={() => setAjustando(ingrediente)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition-colors shadow-xs"
                      >
                        <SlidersHorizontal size={14} />
                        <span>Ajuste</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </Table>
      </div>

      <IngredientModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setEditando(null);
        }}
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
        errorMessage={errorEliminar}
        onClose={() => {
          setEliminando(null);
          setErrorEliminar("");
        }}
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
