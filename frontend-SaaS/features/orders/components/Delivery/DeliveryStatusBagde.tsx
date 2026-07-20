interface Props {
  status: string;
}

export default function DeliveryStatusBadge({ status }: Props) {
  // Mapeo de traducciones legibles
  const labelMap: Record<string, string> = {
    PENDING: "Pendiente",
    ASSIGNED: "Asignado",
    IN_ROUTE: "En Ruta",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  };

  // Estilos basados exactamente en los badges de tu segunda captura
  const styles: Record<string, string> = {
    PENDING: "bg-[#FCEFC7] text-[#8C6D1C]",
    ASSIGNED: "bg-[#E0F2FE] text-[#0369A1]",
    IN_ROUTE: "bg-[#F3E8FF] text-[#6B21A8]",
    DELIVERED: "bg-[#D1FAE5] text-[#065F46]",
    CANCELLED: "bg-[#FEE2E2] text-[#991B1B]",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        font-semibold
        text-xs
        shadow-sm
        inline-block
        ${styles[status] || "bg-gray-100 text-gray-750"}
      `}
    >
      {labelMap[status] || status}
    </span>
  );
}
