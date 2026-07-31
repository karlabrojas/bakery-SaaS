"use client";

import { useEffect, useState } from "react";
import { Ingredient } from "../types/inventory.type";
import { obtenerIngredientePorId } from "../services/inventory.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ingrediente: Ingredient | null;
}

export default function IngredientDetailModal({ isOpen, onClose, ingrediente }: Props) {
    const [detalle, setDetalle] = useState<any>(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!isOpen || !ingrediente) return;
        setCargando(true);
        obtenerIngredientePorId(Number(ingrediente.id))
            .then(setDetalle)
            .catch(console.error)
            .finally(() => setCargando(false));
    }, [isOpen, ingrediente]);

    if (!isOpen || !ingrediente) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-10">✕</button>

                <div className="w-full space-y-6 p-6">
                    
                    <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-white">Detalle del Ingrediente</h2>
                        <p className="text-sm text-[#FBEACE] mt-1">{ingrediente.name}</p>
                    </div>

                    {cargando ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-stone-500">Cargando información...</p>
                        </div>
                    ) : detalle && (
                        <>
                        
                            <div className="grid grid-cols-2 gap-4 bg-stone-50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Nombre</p>
                                    <p className="mt-1 text-sm font-semibold">{detalle.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Unidad de medida</p>
                                    <span className="mt-1 inline-block px-2 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium">
                                        {detalle.unit}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Stock disponible</p>
                                    <p className={`mt-1 text-2xl font-black ${detalle.quantity <= detalle.minimum_stock ? "text-red-500" : "text-[#472D20]"
                                        }`}>
                                        {detalle.quantity} <span className="text-sm font-medium">{detalle.unit}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Stock mínimo</p>
                                    <p className="mt-1 text-2xl font-black text-stone-600">
                                        {detalle.minimum_stock} <span className="text-sm font-medium">{detalle.unit}</span>
                                    </p>
                                </div>
                            </div>

                        
                            {detalle.quantity <= detalle.minimum_stock && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium">
                                    ⚠️ Stock por debajo del mínimo requerido
                                </div>
                            )}

                            
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                                    Historial de movimientos
                                </h3>

                                {detalle.movimientos.length === 0 ? (
                                    <p className="text-sm text-stone-400 text-center py-4">Sin movimientos registrados.</p>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {detalle.movimientos.map((mov: any) => (
                                            <div key={mov.id} className="flex items-center justify-between border border-stone-100 rounded-xl px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${mov.movement_type === "ENTRADA"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                        }`}>
                                                        {mov.movement_type}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-semibold">
                                                            {mov.movement_type === "ENTRADA" ? "+" : "-"}{mov.quantity} {detalle.unit}
                                                        </p>
                                                        {mov.reason && (
                                                            <p className="text-xs text-stone-500">{mov.reason}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-stone-400 whitespace-nowrap">
                                                    {new Date(mov.movement_date).toLocaleDateString("es-MX", {
                                                        timeZone: "America/Mexico_City",
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}