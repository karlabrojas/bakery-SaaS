"use client";

import React, { useState, useEffect } from "react";
import { Order } from "../types/order.type";
import { changeOrderStatus, updateOrder } from "../services/orders.service";
import {
  X,
  FileText,
  Truck,
  Calendar,
  Clock,
  MessageSquare,
  DollarSign,
} from "lucide-react";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  order: Order | null;
}

export default function EditOrderModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: EditOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState<Order["status"]>("PENDING");
  const [deliveryType, setDeliveryType] =
    useState<Order["delivery_type"]>("PICKUP");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && order) {
      setStatus(order.status);
      setDeliveryType(order.delivery_type || (order as any).deliveryType);
      setDeliveryDate(order.delivery_date || (order as any).deliveryDate || "");
      setDeliveryTime(order.delivery_time || (order as any).deliveryTime || "");
      setNotes(order.notes || "");
      setError("");
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await updateOrder(order.id, {
        deliveryType: deliveryType,
        deliveryDate: deliveryDate,
        deliveryTime: deliveryTime,
        notes,
      });

      if (status !== order.status) {
        await changeOrderStatus(order.id, status);
      }

      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error al actualizar la orden:", err);
      setError(err.message || "No se pudo actualizar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-[#FFFDF9] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="relative bg-[#472D20] px-6 py-5 rounded-t-2xl flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Editar Pedido</h2>
            <p className="text-sm text-[#FBEACE] mt-1">Folio: {order.folio}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          <div className="space-y-6 p-6 flex-1">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 font-medium text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6F0] rounded-xl p-5 border border-[#EFE9DD]">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#472D20]" /> Estado
                  actual
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="IN_PRODUCTION">En producción</option>
                  <option value="READY">Listo / Por Entregar</option>
                  <option value="DELIVERED">Entregado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#472D20]" /> Tipo de
                  entrega
                </label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
                >
                  <option value="PICKUP">Recoger en tienda</option>
                  <option value="DELIVERY">Envío a domicilio</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#472D20]" /> Fecha de
                  entrega
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#472D20]" /> Hora de
                  entrega
                </label>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#472D20]" /> Notas
                  / Observaciones
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Añade especificaciones sobre la entrega o la preparación..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-white border border-[#EFE9DD] p-4 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-stone-600 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-stone-500" /> Total
                acumulado del pedido:
              </span>
              <span className="text-xl font-black text-[#472D20]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-[#E6DEC9] bg-[#FAF6F0] p-4 flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#472D20] text-white rounded-xl text-sm font-bold hover:bg-[#362117] disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
