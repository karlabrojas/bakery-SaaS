"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order.type";
import { OrderStatusBadge } from "./OrderStatusBadge";

// Importaciones de tus componentes UI del sistema de diseño
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Table from "@/components/ui/Table";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import OrderDetailModal from "./OrderDetailModal";

// 🚀 Servicios del sistema
import { fetchProducts } from "@/features/products/services/products.service";
// Ajusta la ruta de importación de acuerdo a dónde guardaste tu servicio de clientes:
import { fetchCustomers, createCustomer } from "../services/customers.service";

export function OrdersTable() {
  const {
    orders,
    loading,
    error,
    loadOrders,
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
        <p className="text-sm text-stone-500">Cargando pedidos...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600">
        {error}
      </div>
    );

  const tableHeaders = [
    "Folio",
    "Estado",
    "Entrega",
    "Fecha",
    "Total",
    "Acciones",
  ];

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button variant="primary" onClick={() => setModalCrear(true)}>
          + Nuevo Pedido
        </Button>
      </div>

      {/* 🛠️ SOLUCIÓN: Pasamos las propiedades obligatorias de clientes que faltaban */}
      <CreateOrderModal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={loadOrders}
        fetchProducts={fetchProducts}
        fetchCustomers={fetchCustomers} // 👈 Añadido
        onCreateCustomer={createCustomer} // 👈 Añadido
      />

      {/* Uso de tu componente personalizado Table */}
      <div className="overflow-x-auto">
        <Table headers={tableHeaders}>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-stone-400">
                No hay pedidos registrados.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#EAD9B6]/40 hover:bg-[#FFF8E0]/30 transition-colors"
              >
                <td className="px-2 py-4 font-bold text-[#472D20]">
                  {order.folio}
                </td>
                <td className="px-2 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-2 py-4 capitalize">
                  {order.delivery_type === "PICKUP" ? "🏠 Recoger" : "🚚 Envío"}
                </td>
                <td className="px-2 py-4 text-[#5A2E1F]">
                  {order.delivery_date}
                </td>
                <td className="px-2 py-4 font-bold text-[#472D20]">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-2 py-4">
                  <div className="flex items-center gap-2">
                    {order.delivery_type === "DELIVERY" && (
                      <Button
                        variant="secondary"
                        className="text-xs px-4 py-2"
                        onClick={() =>
                          router.push(`/orders/delivery?orderId=${order.id}`)
                        }
                      >
                        🚚 Logística
                      </Button>
                    )}

                    {order.status === "READY" && (
                      <Button
                        variant="secondary"
                        className="text-xs px-4 py-2 bg-green-100 text-green-800 border border-green-300"
                        onClick={() => setConvirtiendo(order)}
                      >
                        Vender
                      </Button>
                    )}

                    {["PENDING", "CANCELLED"].includes(order.status) && (
                      <Button
                        variant="danger"
                        className="text-xs px-4 py-2"
                        onClick={() => setEliminando(order)}
                      >
                        Eliminar
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      className="text-xs px-4 py-2"
                      onClick={() => setEditando(order)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="link"
                      className="text-xs font-bold"
                      onClick={() => setDetalle(order)}
                    >
                      Detalle
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      </div>

      {/* Componentes de Modal Compartidos */}
      <ConfirmModal
        isOpen={!!eliminando}
        title="Eliminar pedido"
        message={`¿Desea eliminar el pedido "${eliminando?.folio}"?`}
        confirmText="Eliminar"
        loading={loadingDelete}
        variant="danger"
        error={errorEliminar}
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
