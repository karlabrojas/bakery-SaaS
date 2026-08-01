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
import {
  X,
  Home,
  Truck,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";

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

  useEffect(() => {
    if (!isOpen || !order?.id) return;

    let isMounted = true;

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
  }, [isOpen, order?.id]);

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

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#FFFDF9] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="relative bg-[#472D20] px-6 py-5 flex justify-between items-start sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Detalle del Pedido
              </h2>
              <p className="text-sm text-[#FBEACE] mt-0.5 font-medium">
                Folio: {order.folio}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6F0] rounded-xl p-5 border border-[#EFE9DD]">
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
                <p className="mt-1 text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  {order.delivery_type === "PICKUP" ? (
                    <>
                      <Home className="w-4 h-4 text-[#472D20]" /> Recoger en
                      tienda
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-[#472D20]" /> Envío a
                      domicilio
                    </>
                  )}
                </p>
              </div>

              <div className="border-t border-[#E6DEC9]/60 md:border-t-0 pt-2 md:pt-0">
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Fecha de entrega
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-800">
                  {order.delivery_date}
                </p>
              </div>

              <div className="border-t border-[#E6DEC9]/60 md:border-t-0 pt-2 md:pt-0">
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Hora de entrega
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-800">
                  {order.delivery_time}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 border-t border-[#E6DEC9] pt-3">
                <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Cliente
                </p>
                <p className="mt-0.5 text-sm font-semibold text-stone-800">
                  {getCustomerName(order.customer_id)}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-between items-center bg-white border border-[#EFE9DD] p-3 rounded-xl mt-1">
                <span className="text-sm font-bold text-stone-600">
                  Monto Total:
                </span>
                <span className="text-xl font-black text-[#472D20]">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {order.notes && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Notas
                  </p>
                  <p className="mt-1 text-sm text-stone-700 bg-[#FFFDF9] p-3 rounded-lg border border-[#E6DEC9]">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                Productos del pedido
              </h3>
              <div className="divide-y divide-[#EFE9DD] border border-[#EFE9DD] rounded-xl overflow-hidden shadow-sm bg-white">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center px-4 py-3 hover:bg-[#FAF6F0]/40 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-stone-800">
                        {getProductName(item.product_id)}
                      </p>
                      <p className="text-xs font-medium text-stone-500 mt-0.5">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#472D20]">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {transicionesDisponibles.length > 0 && (
              <div className="space-y-3 bg-[#FAF6F0] p-4 border border-[#EFE9DD] rounded-xl">
                <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                  Acción: Avanzar de estado
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <select
                    value={nuevoEstado}
                    onChange={(e) =>
                      setNuevoEstado(e.target.value as OrderStatus)
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white text-stone-800 font-medium shadow-sm"
                  >
                    <option value="">Selecciona el siguiente paso...</option>
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
                    placeholder="Escribe un comentario opcional..."
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white text-stone-800 shadow-sm"
                  />
                </div>

                {exitoStatus && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Estado actualizado
                    correctamente
                  </div>
                )}
                {errorStatus && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />{" "}
                    {errorStatus}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCambiarEstado}
                  disabled={!nuevoEstado || loadingStatus}
                  className={`w-full h-11 text-sm font-bold bg-[#472D20] text-white rounded-xl transition shadow-sm ${
                    !nuevoEstado || loadingStatus
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#362117] active:transform active:scale-[0.99]"
                  }`}
                >
                  {loadingStatus ? "Guardando..." : "Actualizar Estado"}
                </button>
              </div>
            )}

            {order.status === "READY" && (
              <button
                type="button"
                onClick={() => setConfirmarConvertir(true)}
                className="w-full h-12 text-sm font-bold bg-green-700 text-white rounded-xl hover:bg-green-800 transition shadow-sm active:transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" /> Convertir a Venta Directa
              </button>
            )}

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                Bitácora / Historial del pedido
              </h3>
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="w-6 h-6 border-2 border-[#472D20] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-400">
                    Cargando línea de tiempo...
                  </p>
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4 bg-stone-50 rounded-xl border border-dashed">
                  Sin registro previo (Estado inicial: Pendiente)
                </p>
              ) : (
                <div className="space-y-2.5">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex justify-between items-start gap-3 border border-[#EFE9DD] rounded-xl p-3 bg-white shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {h.previous_status && (
                            <>
                              <span className="text-xs font-semibold text-stone-400 line-through">
                                {STATUS_LABELS[
                                  h.previous_status as OrderStatus
                                ] ?? h.previous_status}
                              </span>
                              <ArrowRight className="w-3 h-3 text-stone-300" />
                            </>
                          )}
                          <span className="text-xs font-bold text-[#472D20] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EFE9DD]">
                            {STATUS_LABELS[h.current_status as OrderStatus] ??
                              h.current_status}
                          </span>
                        </div>
                        {h.comments && (
                          <p className="text-xs text-stone-600 mt-1.5 bg-stone-50 p-2 rounded border border-stone-100 font-medium flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-stone-400 shrink-0" />{" "}
                            {h.comments}
                          </p>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-stone-400 whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(h.changed_at).toLocaleString("es-MX", {
                          timeZone: "America/Mexico_City",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
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
