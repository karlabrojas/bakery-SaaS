"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order.type";
import { OrderStatusBadge } from "./OrderStatusBadge";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/ui/Table";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import OrderDetailModal from "./OrderDetailModal";

import { fetchProducts } from "@/features/products/services/products.service";
import { fetchCustomers, createCustomer } from "../services/customers.service";

import {
  Store,
  Truck,
  Eye,
  Pencil,
  MapPin,
  CheckCircle2,
  Trash2,
} from "lucide-react";

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
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-500">
          Cargando pedidos de la panadería...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600 max-w-2xl mx-auto my-8">
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
          + Agregar Pedido
        </button>
      </div>

      <h2 className="text-2xl font-bold text-[#472D20] mb-4">
        Historial de Pedidos
      </h2>

      <div className="flex flex-col gap-3 md:hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#FFF8E0] border-2 border-dashed border-[#B8926B]">
            <p className="text-sm font-semibold text-[#8C6D53]">
              No hay pedidos registrados en el sistema.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#FFF8E0] rounded-2xl border-2 border-[#B8926B] shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="bg-[#FBEACE] text-[#472D20] text-xs font-bold px-2.5 py-1 rounded-md tracking-wider border border-[#B8926B]">
                  {order.folio}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#FBEACE] rounded-xl py-2 border border-[#B8926B]">
                  <p className="text-xs text-[#8C6D53] mb-0.5">Entrega</p>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#472D20]">
                    {order.delivery_type === "PICKUP" ? (
                      <>
                        <Store size={14} className="text-[#8C6D53]" /> Recoger
                      </>
                    ) : (
                      <>
                        <Truck size={14} className="text-amber-800" /> Envío
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-[#FBEACE] rounded-xl py-2 border border-[#B8926B]">
                  <p className="text-xs text-[#8C6D53] mb-0.5">Total</p>
                  <p className="font-bold text-base font-mono text-[#472D20]">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="text-xs text-stone-600 text-center font-medium">
                Fecha prometida:{" "}
                <span className="font-bold text-[#472D20]">
                  {order.delivery_date}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setDetalle(order)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FBEACE] hover:bg-[#EAD9B6] text-[#472D20] border border-[#B8926B] text-xs font-semibold transition shadow-xs"
                >
                  <Eye size={12} className="text-[#8C6D53]" /> Detalle
                </button>
                <button
                  onClick={() => setEditando(order)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#D9C3A9] text-xs font-semibold transition shadow-xs"
                >
                  <Pencil size={12} className="text-[#8C6D53]" /> Editar
                </button>
                {order.delivery_type === "DELIVERY" && (
                  <button
                    onClick={() =>
                      router.push(`/orders/delivery?orderId=${order.id}`)
                    }
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition shadow-xs"
                  >
                    <MapPin size={12} /> Ruta
                  </button>
                )}
                {order.status === "READY" && (
                  <button
                    onClick={() => setConvirtiendo(order)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition shadow-xs"
                  >
                    <CheckCircle2 size={12} /> Vender
                  </button>
                )}
                {["PENDING", "CANCELLED"].includes(order.status) && (
                  <button
                    onClick={() => setEliminando(order)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition shadow-xs"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block overflow-hidden bg-[#FFF8E0] rounded-xl shadow-md border-2 border-[#B8926B]">
        <Table headers={tableHeaders}>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-12 text-[#8C6D53] font-semibold bg-[#FFF8E0]"
              >
                No hay pedidos registrados en el sistema.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#EAD9B6] last:border-none hover:bg-[#FBEACE]/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="bg-[#FBEACE] text-[#472D20] text-xs font-bold px-2.5 py-1 rounded-md tracking-wider border border-[#B8926B]">
                    {order.folio}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-6 py-4 text-[#472D20] text-sm font-medium">
                  {order.delivery_type === "PICKUP" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FBEACE] border border-[#B8926B] text-xs font-semibold text-[#472D20]">
                      <Store size={14} className="text-[#8C6D53]" />
                      <span>Recoger</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                      <Truck size={14} />
                      <span>Envío</span>
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-[#5A2E1F] text-sm font-medium">
                  {order.delivery_date}
                </td>

                <td className="px-6 py-4 font-bold text-[#472D20] text-base font-mono">
                  ${order.total.toFixed(2)}
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      title="Detalle"
                      onClick={() => setDetalle(order)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#FBEACE] hover:bg-[#EAD9B6] text-[#472D20] border border-[#B8926B] rounded-lg transition-colors shadow-xs"
                    >
                      <Eye size={14} className="text-[#8C6D53]" />
                      <span>Detalle</span>
                    </button>

                    <button
                      title="Editar"
                      onClick={() => setEditando(order)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-50 hover:bg-[#EAD9B6] text-stone-700 rounded-lg transition-colors border border-[#D9C3A9] shadow-xs"
                    >
                      <Pencil size={14} className="text-[#8C6D53]" />
                      <span>Editar</span>
                    </button>

                    {order.delivery_type === "DELIVERY" && (
                      <button
                        title="Ruta"
                        onClick={() =>
                          router.push(`/orders/delivery?orderId=${order.id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors border border-amber-200 shadow-xs"
                      >
                        <MapPin size={14} />
                        <span>Ruta</span>
                      </button>
                    )}

                    {order.status === "READY" && (
                      <button
                        title="Vender"
                        onClick={() => setConvirtiendo(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200 shadow-xs"
                      >
                        <CheckCircle2 size={14} />
                        <span>Vender</span>
                      </button>
                    )}

                    {["PENDING", "CANCELLED"].includes(order.status) && (
                      <button
                        title="Eliminar"
                        onClick={() => setEliminando(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 shadow-xs"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      </div>

      <CreateOrderModal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={async (payload) => {
          try {
            await handleCreateOrder(payload);

            setModalCrear(false);
            loadOrders();
          } catch (error: any) {
            console.error("Error en el flujo de creación:", error);
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
