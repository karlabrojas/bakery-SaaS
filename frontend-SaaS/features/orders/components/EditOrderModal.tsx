import React, { useState, useEffect } from "react";
import { Order } from "../types/order.type";
// 🚀 Asegúrate de importar tu servicio para actualizar aquí:
// import { updateOrder } from "../services/orders.service";

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

  // 1. Estados locales alineados a los campos de la base de datos
  const [status, setStatus] = useState<Order["status"]>("PENDING");
  const [deliveryType, setDeliveryType] =
    useState<Order["delivery_type"]>("PICKUP");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");

  // 2. Efecto para rellenar los inputs con la información actual al abrir el formulario
  useEffect(() => {
    if (isOpen && order) {
      setStatus(order.status);
      setDeliveryType(order.delivery_type);
      setDeliveryDate(order.delivery_date || "");
      setDeliveryTime(order.delivery_time || "");
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

      // 🚀 Petición HTTP pasándole los estados modificados
      // await updateOrder(order.id, {
      //   status,
      //   delivery_type: deliveryType,
      //   delivery_date: deliveryDate,
      //   delivery_time: deliveryTime,
      //   notes
      // });

      await onSuccess(); // Refresca la tabla
      onClose(); // Cierra el modal
    } catch (err: any) {
      console.error("Error al actualizar la orden:", err);
      setError(err.message || "No se pudo actualizar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera Fija (Estilo Café Sólido como OrderDetailModal) */}
        <div className="relative bg-[#472D20] px-6 py-5 rounded-t-2xl flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Editar Pedido</h2>
            <p className="text-sm text-[#FBEACE] mt-1">Folio: {order.folio}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl font-bold p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo con Scroll y Formulario */}
        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          <div className="space-y-6 p-6 flex-1">
            {/* Mensaje de error si ocurre una falla */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 font-medium text-center">
                {error}
              </div>
            )}

            {/* Grid del Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 rounded-xl p-5 border border-stone-200/40">
              {/* Estado del Pedido */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Estado actual
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium"
                >
                  <option value="PENDING">Pendiente ⏳</option>
                  <option value="CONFIRMED">Confirmado 👍</option>
                  <option value="IN_PRODUCTION">En producción 🥖</option>
                  <option value="READY">Listo / Por Entregar 📦</option>
                  <option value="DELIVERED">Entregado ✅</option>
                  <option value="CANCELLED">Cancelado ❌</option>
                </select>
              </div>

              {/* Tipo de Entrega */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Tipo de entrega
                </label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium"
                >
                  <option value="PICKUP">🏠 Recoger en tienda</option>
                  <option value="DELIVERY">🚚 Envío a domicilio</option>
                </select>
              </div>

              {/* Fecha de Entrega */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Fecha de entrega
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium"
                />
              </div>

              {/* Hora de Entrega */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Hora de entrega
                </label>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium"
                />
              </div>

              {/* Notas del pedido */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Notas / Observaciones
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Añade especificaciones sobre la entrega o la preparación..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium resize-none"
                />
              </div>
            </div>

            {/* Información estática informativa del total */}
            <div className="flex justify-between items-center bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl">
              <span className="text-sm font-semibold text-stone-600">
                Total acumulado del pedido:
              </span>
              <span className="text-xl font-black text-[#472D20]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Acciones del Formulario Fijas Abajo */}
          <div className="border-t border-stone-100 bg-stone-50/50 p-4 flex justify-end gap-3 sticky bottom-0">
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
