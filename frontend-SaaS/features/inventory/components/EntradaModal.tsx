"use client";

import { useState } from "react";
import { Ingredient } from "../types/inventory.type";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    ingrediente: Ingredient | null;
    onEntrada: (datos: {
        inventory_id: number;
        quantity: number;
        reason?: string;
        movement_date: string;
    }) => Promise<void>;
}

export default function EntradaModal({ isOpen, onClose, onSuccess, ingrediente, onEntrada }: Props) {
    const [cantidad, setCantidad] = useState("");
    const [motivo, setMotivo] = useState("");
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !ingrediente) return null;

    const handleGuardar = async () => {
        if (!cantidad || Number(cantidad) <= 0) {
            setError("La cantidad debe ser mayor a 0");
            return;
        }
        if (!fecha) {
            setError("La fecha es obligatoria");
            return;
        }

        setCargando(true);
        setError("");

        try {
            await onEntrada({
                inventory_id: Number(ingrediente.id),
                quantity: Number(cantidad),
                reason: motivo,
                movement_date: fecha,
            });

            setCantidad("");
            setMotivo("");
            setFecha(new Date().toISOString().split("T")[0]);
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
                        <h2 className="text-2xl font-bold text-white">Registrar Entrada</h2>
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
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Cantidad *</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="0"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Fecha *</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">Motivo</label>
                            <input
                                type="text"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ej. Compra semanal"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                        </div>
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
                            {cargando ? "Registrando..." : "Registrar Entrada"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}