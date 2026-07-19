"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../types/order.type";
import {
  changeOrderStatus,
  convertOrderToSale,
  fetchOrderHistory,
} from "../services/orders.service";
import { OrderStatusBadge } from "./OrderStatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { fetchProducts } from "@/features/products/services/products.service";
import { fetchCustomers } from "../services/customers.service";
import DeliveryStatusBadge from "./Delivery/DeliveryStatusBagde";
import { useDeliveries } from "../hooks/useDeliveries";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
}

interface ProductCatalog {
  id: string;
  name: string;
}
interface CustomerCatalog {
  id: string;
  name: string;
  phone?: string;
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

export default function OrderDetailModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<OrderStatus | "">("");
  const [comentario, setComentario] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [exitoStatus, setExitoStatus] = useState(false);
  const [confirmarConvertir, setConfirmarConvertir] = useState(false);
  const [loadingConvertir, setLoadingConvertir] = useState(false);

  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [customers, setCustomers] = useState<CustomerCatalog[]>([]);
  const { delivery, loadDelivery } = useDeliveries();

  // 🛠️ EFECTO CORREGIDO: Se previene el bucle infinito removiendo loadDelivery de las dependencias directas
  useEffect(() => {
    if (!isOpen || !order?.id) return;

    let isMounted = true;

    // 1. Carga del historial
    setLoadingHistory(true);
    fetchOrderHistory(order.id)
      .then((data) => {
        if (isMounted) setHistory(data || []);
      })
      .catch((err) => {
        console.error("Error al cargar historial:", err);
        if (isMounted) setHistory([]);
      })
      .finally(() => {
        if (isMounted) setLoadingHistory(false);
      });

    // 2. Carga de delivery (Ejecutado de forma segura)
    loadDelivery(order.id);

    // 3. Carga de catálogos estáticos
    fetchProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => console.error("Error controlado en fetchProducts:", err));

    fetchCustomers()
      .then((data) => {
        if (isMounted) setCustomers(data);
      })
      .catch((err) =>
        console.error("Error controlado en fetchCustomers:", err),
      );

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, order?.id]); // 👈 Quitamos loadDelivery para evitar re-ejecución infinita

  if (!isOpen || !order) return null;

  const transicionesDisponibles = STATUS_TRANSITIONS[order.status] || [];

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name ?? "Producto";
  };

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return "Cliente general";
    const customer = customers.find((c) => c.id === customerId);
    return customer
      ? `${customer.name} ${customer.phone ? `— ${customer.phone}` : ""}`
      : "Cliente general";
  };

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
      setErrorStatus(err.message || "Error al cambiar el estado");
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
      setErrorStatus(err.message || "Error al convertir a venta");
    } finally {
      setLoadingConvertir(false);
    }
  };

  const deliveryData = delivery as any;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Cabecera Fija */}
          <div className="relative bg-[#472D20] px-6 py-5 rounded-t-2xl flex justify-between items-start sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Detalle del Pedido
              </h2>
              <p className="text-sm text-[#FBEACE] mt-1">
                Folio: {order.folio}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white text-xl font-bold p-1 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          {/* Cuerpo con Scroll */}
          <div className="w-full space-y-6 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 bg-stone-50 rounded-xl p-4">
              <div>
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Estado actual
                </p>
                <div className="mt-1">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Tipo de entrega
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {order.delivery_type === "PICKUP"
                    ? "Recoger en tienda"
                    : "Envío a domicilio"}
                </p>
              </div>

              {deliveryData && order.delivery_type === "DELIVERY" && (
                <div className="col-span-2 border-t border-stone-200/60 pt-3 mt-1">
                  <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Estado entrega
                  </p>
                  <div className="mt-2">
                    <DeliveryStatusBadge status={deliveryData.status} />
                  </div>
                  <p className="mt-3 text-sm">
                    <b>Dirección:</b>
                    <br />
                    {deliveryData.address}
                  </p>
                  {deliveryData.reference && (
                    <p className="text-sm mt-2 bg-stone-100 p-2.5 rounded-lg border border-stone-200/40">
                      <b>Referencia:</b> {deliveryData.reference}
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Fecha de entrega
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {order.delivery_date}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Hora de entrega
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {order.delivery_time}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Cliente
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {getCustomerName(order.customer_id)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Total
                </p>
                <p className="mt-1 text-lg font-black text-[#472D20]">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              {order.notes && (
                <div className="col-span-2">
                  <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Notas
                  </p>
                  <p className="mt-1 text-sm text-stone-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                Productos
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center px-4 py-3 bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {getProductName(item.product_id)}
                      </p>
                      <p className="text-xs text-stone-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {transicionesDisponibles.length > 0 && (
              <div className="space-y-3 bg-stone-50/50 p-4 border border-stone-200/60 rounded-xl">
                <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                  Cambiar estado
                </h3>
                <select
                  value={nuevoEstado}
                  onChange={(e) =>
                    setNuevoEstado(e.target.value as OrderStatus)
                  }
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
                  placeholder="Comentario opcional"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
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
                  type="button"
                  onClick={handleCambiarEstado}
                  disabled={!nuevoEstado || loadingStatus}
                  className={`w-full h-12 text-sm font-bold bg-[#472D20] text-white rounded-xl transition ${
                    !nuevoEstado || loadingStatus
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-[#362117]"
                  }`}
                >
                  {loadingStatus ? "Actualizando..." : "Cambiar Estado"}
                </button>
              </div>
            )}

            {order.status === "READY" && (
              <button
                type="button"
                onClick={() => setConfirmarConvertir(true)}
                className="w-full h-12 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Convertir a Venta
              </button>
            )}

            {/* Sección de Historial */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                Historial de estados
              </h3>
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="w-6 h-6 border-2 border-[#472D20] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-stone-400 text-center">
                    Cargando historial...
                  </p>
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">
                  Sin historial (El estado inicial es Pendiente)
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex gap-3 items-start border border-stone-100 rounded-xl p-3 bg-white"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {h.previous_status && (
                            <>
                              <span className="text-xs font-semibold text-stone-500">
                                {STATUS_LABELS[
                                  h.previous_status as OrderStatus
                                ] ?? h.previous_status}
                              </span>
                              <span className="text-stone-400">→</span>
                            </>
                          )}
                          <span className="text-xs font-bold text-[#472D20]">
                            {STATUS_LABELS[h.current_status as OrderStatus] ??
                              h.current_status}
                          </span>
                        </div>
                        {h.comments && (
                          <p className="text-xs text-stone-500 mt-1">
                            {h.comments}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 whitespace-nowrap">
                        {new Date(h.changed_at).toLocaleString("es-MX", {
                          timeZone: "America/Mexico_City",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
