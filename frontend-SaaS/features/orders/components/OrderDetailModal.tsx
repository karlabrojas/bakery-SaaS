"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../types/order.type";
import { changeOrderStatus,  convertOrderToSale } from "../services/orders.service";
import { OrderStatusBadge } from "./OrderStatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    order: Order | null;
}

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PRODUCTION", "CANCELLED"],
    IN_PRODUCTION: ["READY", "CANCELLED"],
    READY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    IN_PRODUCTION: "En producción",
    READY: "Listo",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

export default function OrderDetailModal({ isOpen, onClose, onSuccess, order }: Props) {
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState<OrderStatus | "">("");
    const [comentario, setComentario] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [exitoStatus, setExitoStatus] = useState(false);
    const [confirmarConvertir, setConfirmarConvertir] = useState(false);
    const [loadingConvertir, setLoadingConvertir] = useState(false);

    useEffect(() => {
        if (!isOpen || !order) return;
        setLoadingHistory(true);
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    const transicionesDisponibles = STATUS_TRANSITIONS[order.status];

    const handleCambiarEstado = async () => {
        if (!nuevoEstado) return;
        setLoadingStatus(true);
        setErrorStatus("");
        try {
            await changeOrderStatus(order.id, nuevoEstado, comentario);
            setExitoStatus(true);
            setTimeout(() => {
                setExitoStatus(false);
                setNuevoEstado("");
                setComentario("");
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setErrorStatus(err.message);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleConvertir = async () => {
        setLoadingConvertir(true);
        try {
            await convertOrderToSale(order.id);
            setConfirmarConvertir(false);
            onSuccess();
            onClose();
        } catch (err: any) {
            setErrorStatus(err.message);
        } finally {
            setLoadingConvertir(false);
        }
    };

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">

                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-10">✕</button>

                    <div className="w-full space-y-6 p-6">
                        
                        <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">Detalle del Pedido</h2>
                            <p className="text-sm text-[#FBEACE] mt-1">Folio: {order.folio}</p>
                        </div>

                    
                        <div className="grid grid-cols-2 gap-4 bg-stone-50 rounded-xl p-4">
                            <div>
                                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Estado actual</p>
                                <div className="mt-1">
                                    <OrderStatusBadge status={order.status} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Tipo de entrega</p>
                                <p className="mt-1 text-sm font-semibold">
                                    {order.delivery_type === "PICKUP" ? "Recoger en tienda" : "Envío a domicilio"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Fecha de entrega</p>
                                <p className="mt-1 text-sm font-semibold">{order.delivery_date}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Hora de entrega</p>
                                <p className="mt-1 text-sm font-semibold">{order.delivery_time}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Total</p>
                                <p className="mt-1 text-lg font-black text-[#472D20]">${order.total.toFixed(2)}</p>
                            </div>
                            {order.notes && (
                                <div>
                                    <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">Notas</p>
                                    <p className="mt-1 text-sm">{order.notes}</p>
                                </div>
                            )}
                        </div>

                    
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">Productos</h3>
                            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center px-4 py-3">
                                        <div>
                                            <p className="text-sm font-semibold">Producto</p>
                                            <p className="text-xs text-stone-500">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold">${item.subtotal.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    
                        {transicionesDisponibles.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">Cambiar estado</h3>
                                <select
                                    value={nuevoEstado}
                                    onChange={(e) => setNuevoEstado(e.target.value as OrderStatus)}
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
                                >
                                    <option value="">Selecciona un estado</option>
                                    {transicionesDisponibles.map((status) => (
                                        <option key={status} value={status}>
                                            {STATUS_LABELS[status]}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    placeholder="Comentario opcional..."
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                                />

                                {exitoStatus && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl text-center font-medium">
                                        Estado actualizado correctamente
                                    </div>
                                )}
                                {errorStatus && (
                                    <p className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium">
                                        {errorStatus}
                                    </p>
                                )}

                                <button
                                    onClick={handleCambiarEstado}
                                    disabled={!nuevoEstado || loadingStatus}
                                    className={`w-full h-12 text-sm font-bold bg-[#472D20] text-white rounded-xl transition ${!nuevoEstado || loadingStatus ? "opacity-60 cursor-not-allowed" : "hover:bg-[#5c3a2a]"
                                        }`}
                                >
                                    {loadingStatus ? "Actualizando..." : "Cambiar Estado"}
                                </button>
                            </div>
                        )}

                        
                        {order.status === "READY" && (
                            <button
                                onClick={() => setConfirmarConvertir(true)}
                                className="w-full h-12 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                            >
                                Convertir a Venta
                            </button>
                        )}

                        
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmarConvertir}
                title="Convertir a venta"
                message={`¿Desea convertir el pedido "${order.folio}" a venta? Esta acción no se puede deshacer.`}
                confirmText="Convertir"
                loading={loadingConvertir}
                variant="primary"
                onClose={() => setConfirmarConvertir(false)}
                onConfirm={handleConvertir}
            />
        </>
    );
}