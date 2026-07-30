"use client";

import { useEffect, useState } from "react";
import { Ingredient } from "../types/inventory.type";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    ingrediente?: Ingredient | null;
    onCrear: (datos: { name: string; quantity: number; unit: string, minimum_stock: number }) => Promise<void>;
    onActualizar: (id: string, datos: { name?: string; quantity?: number; unit?: string , minimum_stock: number}) => Promise<void>;
}

const unidades = ["kg", "g", "l", "ml", "piezas", "tazas", "cucharadas", "cucharaditas"];

export default function IngredientModal({ isOpen, onClose, onSuccess, ingrediente, onCrear, onActualizar }: Props) {
    const modoEditar = !!ingrediente;

    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [unidad, setUnidad] = useState("kg");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);
    const [stockMinimo, setStockMinimo] = useState("0");

    useEffect(() => {
        if (!isOpen) return;
        if (ingrediente) {
            setNombre(ingrediente.name);
            setCantidad(String(ingrediente.quantity));
            setUnidad(ingrediente.unit);
            setStockMinimo(String(ingrediente?.minimum_stock ?? 0));
        } else {
            setNombre("");
            setCantidad("");
            setUnidad("kg");
        }
        setError("");
    }, [ingrediente, isOpen]);

    if (!isOpen) return null;

    const validar = () => {
        if (!nombre.trim()) return "El nombre es obligatorio";
        if (!cantidad) return "La cantidad es obligatoria";
        if (Number(cantidad) < 0) return "La cantidad no puede ser negativa";
        if (!unidad) return "La unidad es obligatoria";
        if (Number(stockMinimo) < 0) return "El stock mínimo no puede ser negativo";
        return "";
    };

    const handleGuardar = async () => {
        const errorValidacion = validar();
        if (errorValidacion) { setError(errorValidacion); return; }

        setCargando(true);
        setError("");

        try {
            if (modoEditar && ingrediente) {
                await onActualizar(ingrediente.id, {
                    name: nombre,
                    quantity: Number(cantidad),
                    unit: unidad,
                    minimum_stock: Number(stockMinimo)
                });
            } else {
                await onCrear({
                    name: nombre,
                    quantity: Number(cantidad),
                    unit: unidad,
                    minimum_stock: Number(stockMinimo),
                });
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">

                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-10">✕</button>

                <div className="w-full space-y-6 p-6">
                    
                    <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-white">
                            {modoEditar ? "Editar Ingrediente" : "Nuevo Ingrediente"}
                        </h2>
                        <p className="text-sm text-[#FBEACE] mt-1">
                            {modoEditar ? "Modifica la información del ingrediente." : "Registra un nuevo ingrediente en el inventario."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Nombre *</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Harina de trigo"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Cantidad *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                    Stock mínimo
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={stockMinimo}
                                    onChange={(e) => setStockMinimo(e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Unidad *</label>
                                <select
                                    value={unidad}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
                                >
                                    {unidades.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-stone-200/80 pt-5">
                        {exito && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl text-center font-medium mb-4">
                                ✅ {modoEditar ? "Ingrediente actualizado" : "Ingrediente registrado"} correctamente
                            </div>
                        )}
                        {error && (
                            <p className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium mb-4">
                                {error}
                            </p>
                        )}
                        <button
                            onClick={handleGuardar}
                            disabled={cargando}
                            className={`w-full h-14 text-lg font-bold bg-[#472D20] text-white rounded-xl transition ${cargando ? "opacity-60 cursor-not-allowed" : "hover:bg-[#5c3a2a]"}`}
                        >
                            {cargando ? "Guardando..." : modoEditar ? "Guardar Cambios" : "Registrar Ingrediente"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}