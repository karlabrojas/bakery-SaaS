"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order.type";
import { OrderStatusBadge } from "./OrderStatusBadge";

import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/ui/Table";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import OrderDetailModal from "./OrderDetailModal";

import { fetchProducts } from "@/features/products/services/products.service";
import { fetchCustomers, createCustomer } from "../services/customers.service";
import { createDelivery } from "../services/delivery.service";

export function OrdersTable() {
  const {
    orders,
    loading,
    error,
    loadOrders,
    handleCreateOrder,
    handleDelete,
    handleConvertToSale,
  } = useOrders();
  const router = useRouter();

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

  if (loading)
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-stone-500">
          Cargando pedidos de la panadería...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-sm rounded-xl p-5 text-center text-red-600 max-w-2xl mx-auto my-8">
        {error}
      </div>
    );

  const tableHeaders = [
    "Folio",
    "Estado",
    "Entrega",
    "Fecha Prometida",
    "Total",
    "Acciones",
  ];

  return (
    <>
      {/* CABECERA ESTILO GESTIÓN DE VENTAS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#472D20] tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-stone-600 mt-2 text-[15px]">
            En este apartado puedes gestionar todos los pedidos y órdenes
            especiales de tu panadería.
          </p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="bg-[#472D20] hover:bg-[#362117] text-white font-bold px-6 py-3 rounded-xl transition shadow-sm whitespace-nowrap self-start sm:self-center text-sm tracking-wide"
        >
          Agregar Pedido
        </button>
      </div>

      <h2 className="text-2xl font-bold text-[#472D20] mb-4">
        Historial de Pedidos
      </h2>

      {/* TARJETA BLANCA CONTENEDORA DE LA TABLA */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table headers={tableHeaders}>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-stone-400 text-sm italic"
                >
                  No hay pedidos registrados en el sistema.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF6F0]/40 transition-colors"
                >
                  {/* Folio estilizado como Pill */}
                  <td className="px-4 py-4.5 vertical-middle">
                    <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2.5 py-1 rounded-md tracking-wider">
                      {order.folio}
                    </span>
                  </td>

                  {/* Badge de Estado */}
                  <td className="px-4 py-4.5 vertical-middle">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* Tipo de Entrega */}
                  <td className="px-4 py-4.5 text-stone-600 text-sm font-medium vertical-middle">
                    {order.delivery_type === "PICKUP" ? (
                      <span className="flex items-center gap-1.5">
                        🏠 Recoger
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-800">
                        🚚 Envío
                      </span>
                    )}
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-4.5 text-stone-600 text-sm vertical-middle">
                    {order.delivery_date}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4.5 font-bold text-stone-900 text-sm vertical-middle">
                    ${order.total.toFixed(2)}
                  </td>

                  {/* Acciones del Sistema */}
                  <td className="px-4 py-4.5 vertical-middle">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Detalle (Pill Neutral) */}
                      <button
                        onClick={() => setDetalle(order)}
                        className="text-xs font-semibold px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-lg transition"
                      >
                        Detalle
                      </button>

                      {/* Editar (Pill Neutral) */}
                      <button
                        onClick={() => setEditando(order)}
                        className="text-xs font-semibold px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-lg transition"
                      >
                        Editar
                      </button>

                      {/* Logística de Envíos */}
                      {order.delivery_type === "DELIVERY" && (
                        <button
                          onClick={() =>
                            router.push(`/orders/delivery?orderId=${order.id}`)
                          }
                          className="text-xs font-semibold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg transition"
                        >
                          📦 Ruta
                        </button>
                      )}

                      {/* Convertir a Venta Directa */}
                      {order.status === "READY" && (
                        <button
                          onClick={() => setConvirtiendo(order)}
                          className="text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition"
                        >
                          💸 Vender
                        </button>
                      )}

                      {/* Eliminar (Pill Rojo sutil) */}
                      {["PENDING", "CANCELLED"].includes(order.status) && (
                        <button
                          onClick={() => setEliminando(order)}
                          className="text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg transition"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>
      </div>

      {/* CONTENEDORES DE MODALES */}
      <CreateOrderModal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={async (payload) => {
          try {
            const response = await handleCreateOrder(payload);

            if (payload.deliveryType === "DELIVERY" && payload.deliveryData) {
              const orderId = (response as any)?.data?.id || response?.id;
              if (!orderId) {
                throw new Error(
                  "No se pudo obtener el ID de la orden creada para el envío.",
                );
              }

              const estimatedDeliveryIso =
                payload.deliveryDate && payload.deliveryTime
                  ? new Date(
                      `${payload.deliveryDate}T${payload.deliveryTime}`,
                    ).toISOString()
                  : new Date().toISOString();

              await createDelivery(orderId, {
                address: payload.deliveryData.address,
                recipient_name: payload.deliveryData.recipient_name,
                recipient_phone: payload.deliveryData.recipient_phone,
                status: payload.deliveryData.status || "PENDING",
                notes: payload.deliveryData.notes || "",
                estimated_delivery: estimatedDeliveryIso as any,
              });
            }

            setModalCrear(false);
            loadOrders();
          } catch (error: any) {
            console.error("❌ Error en el flujo de creación:", error);
            alert(error.message || "Ocurrió un error al procesar el pedido.");
          }
        }}
        fetchProducts={fetchProducts}
        fetchCustomers={fetchCustomers}
        onCreateCustomer={createCustomer}
      />

      <ConfirmModal
        isOpen={!!eliminando}
        title="Eliminar pedido"
        message={`¿Desea eliminar el pedido "${eliminando?.folio}"?`}
        confirmText="Eliminar"
        loading={loadingDelete}
        variant="danger"
        errorMessage={errorEliminar}
        onClose={() => {
          setEliminando(null);
          setErrorEliminar("");
        }}
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
