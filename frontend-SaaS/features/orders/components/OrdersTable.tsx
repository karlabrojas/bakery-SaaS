"use client";

import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order.type";
import { OrderStatusBadge } from "./OrderStatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Button from "@/components/ui/Button";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import OrderDetailModal from "./OrderDetailModal";

export function OrdersTable() {
  const { orders, loading, error, loadOrders, handleDelete, handleConvertToSale } = useOrders();

  const [eliminando, setEliminando] = useState<Order | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");


  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState<Order | null>(null);
  const [detalle, setDetalle] = useState<Order | null>(null);
  const [convirtiendo, setConvirtiendo] = useState<Order | null>(null);
  const [loadingConvertir, setLoadingConvertir] = useState(false);

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return;
    setLoadingDelete(true);
    setErrorEliminar("");
    try {
      await handleDelete(eliminando.id);
      setEliminando(null);
    } catch (err: any) {
      setErrorEliminar(err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleConfirmarConvertir = async () => {
    if (!convirtiendo) return;
    setLoadingConvertir(true);
    try {
      await handleConvertToSale(convirtiendo.id);
      setConvirtiendo(null);
      loadOrders();
    } finally {
      setLoadingConvertir(false);
    }
  };

  if (loading) return (
    <div className="py-12 flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-stone-500">Cargando pedidos...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
      {error}
    </div>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalCrear(true)}
          className="px-5 py-2.5 bg-[#472D20] text-white text-sm font-bold rounded-xl hover:bg-[#5c3a2a] transition"
        >
          + Nuevo Pedido
        </button>
      </div>

      <CreateOrderModal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={loadOrders}
      />

      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-stone-100">
        <table className="w-full text-sm">
          <thead className="bg-[#472D20] text-white">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Folio</th>
              <th className="text-left px-4 py-3 font-semibold">Estado</th>
              <th className="text-left px-4 py-3 font-semibold">Entrega</th>
              <th className="text-left px-4 py-3 font-semibold">Fecha</th>
              <th className="text-left px-4 py-3 font-semibold">Total</th>
              <th className="text-left px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400">
                  No hay pedidos registrados.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#472D20]">{order.folio}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {order.delivery_type === "PICKUP" ? "Recoger" : "Envío"}
                  </td>
                  <td className="px-4 py-3">{order.delivery_date}</td>
                  <td className="px-4 py-3 font-bold">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {order.status === "READY" && (
                        <button
                          onClick={() => setConvirtiendo(order)}
                          className="px-3 py-1.5 text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors border border-green-200"
                        >
                          Convertir a venta
                        </button>
                      )}
                      {["PENDING", "CANCELLED"].includes(order.status) && (
                        <button
                          onClick={() => setEliminando(order)}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                        >
                          Eliminar
                        </button>
                      )}
                      <button
                        onClick={() => setEditando(order)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] rounded-lg transition-colors border border-stone-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDetalle(order)}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#FBEACE] hover:bg-[#f0d9a8] text-[#472D20] rounded-lg transition-colors border border-[#B8926B]"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!eliminando}
        title="Eliminar pedido"
        message={`¿Desea eliminar el pedido "${eliminando?.folio}"?`}
        confirmText="Eliminar"
        loading={loadingDelete}
        variant="danger"
        error={errorEliminar}
        onClose={() => { setEliminando(null); setErrorEliminar(""); }}
        onConfirm={handleConfirmarEliminar}
      />

      <EditOrderModal
        isOpen={!!editando}
        onClose={() => setEditando(null)}
        onSuccess={loadOrders}
        order={editando}
      />

      <OrderDetailModal
        isOpen={!!detalle}
        onClose={() => setDetalle(null)}
        onSuccess={loadOrders}
        order={detalle}
      />

      <ConfirmModal
        isOpen={!!convirtiendo}
        title="Convertir a venta"
        message={`¿Desea convertir el pedido "${convirtiendo?.folio}" a venta?`}
        confirmText="Convertir"
        loading={loadingConvertir}
        variant="primary"
        onClose={() => setConvirtiendo(null)}
        onConfirm={handleConfirmarConvertir}
      />
    </>
  );
}