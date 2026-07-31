"use client";

import { useState } from "react";
import { Ingredient } from "../types/inventory.type";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    ingrediente: Ingredient | null;
    onAjuste: (datos: {
        inventory_id: number;
        cantidad_ajustada: number;
        reason: string;
    }) => Promise<void>;
}

export default function AjusteModal({ isOpen, onClose, onSuccess, ingrediente, onAjuste }: Props) {
    const [cantidadAjustada, setCantidadAjustada] = useState("");
    const [motivo, setMotivo] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !ingrediente) return null;

    const handleGuardar = async () => {
        if (!cantidadAjustada || Number(cantidadAjustada) < 0) {
            setError("La cantidad ajustada no puede ser negativa");
            return;
        }
        if (!motivo.trim()) {
            setError("El motivo es obligatorio");
            return;
        }

        setCargando(true);
        setError("");

        try {
            await onAjuste({
                inventory_id: Number(ingrediente.id),
                cantidad_ajustada: Number(cantidadAjustada),
                reason: motivo,
            });

            setCantidadAjustada("");
            setMotivo("");
            onSuccess();
            onClose();
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
                        <h2 className="text-2xl font-bold text-white">Ajuste de Stock</h2>
                        <p className="text-sm text-[#FBEACE] mt-1">
                            Ingrediente: <span className="font-bold">{ingrediente.name}</span>
                        </p>
                    </div>

                    
                    <div className="bg-[#FBEACE] rounded-xl p-4">
                        <p className="text-xs font-bold uppercase text-stone-600 tracking-wider">Stock actual</p>
                        <p className="text-2xl font-black text-[#472D20] mt-1">
                            {ingrediente.quantity} <span className="text-sm font-medium">{ingrediente.unit}</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                Nuevo stock *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={cantidadAjustada}
                                onChange={(e) => setCantidadAjustada(e.target.value)}
                                placeholder={`Stock actual: ${ingrediente.quantity}`}
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                Motivo *
                            </label>
                            <input
                                type="text"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ej. por caducidad"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>

                        {cantidadAjustada !== "" && (
                            <div className={`rounded-xl p-4 ${Number(cantidadAjustada) < ingrediente.quantity
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-green-50 border border-green-200"
                                }`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-stone-600">Diferencia</p>
                                <p className={`text-xl font-black mt-1 ${Number(cantidadAjustada) < ingrediente.quantity ? "text-red-600" : "text-green-600"
                                    }`}>
                                    {Number(cantidadAjustada) >= ingrediente.quantity ? "+" : ""}
                                    {(Number(cantidadAjustada) - ingrediente.quantity).toFixed(2)} {ingrediente.unit}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-stone-200/80 pt-5">
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
                            {cargando ? "Guardando..." : "Aplicar Ajuste"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}