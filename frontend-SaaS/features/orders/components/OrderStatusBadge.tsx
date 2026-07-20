import { OrderStatus } from "../types/order.type";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-700" },
    IN_PRODUCTION: {
      label: "En producción",
      className: "bg-orange-100 text-orange-700",
    },
    READY: { label: "Listo", className: "bg-green-100 text-green-700" },
    DELIVERED: { label: "Entregado", className: "bg-stone-100 text-stone-600" },
    CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-600" },
  };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  // Fallback por si 'status' no coincide con ninguna clave (seguridad en runtime)
  const config = statusConfig[status] || {
    label: status || "Desconocido",
    className: "bg-stone-100 text-stone-500",
  };

  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${config.className}`}
    >
      {config.label}
    </span>
  );
}
