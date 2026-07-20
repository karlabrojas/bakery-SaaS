interface Props {
  status: string;
}

export default function DeliveryTimeline({ status }: Props) {
  const states = ["PENDING", "ASSIGNED", "IN_ROUTE", "DELIVERED"];

  const labelMap: Record<string, string> = {
    PENDING: "Por Planificar",
    ASSIGNED: "Repartidor Asignado",
    IN_ROUTE: "En Ruta de Entrega",
    DELIVERED: "Entregado Con Éxito",
  };

  const current = states.indexOf(status);

  return (
    <div className="relative pl-2 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-4 before:w-0.5 before:bg-stone-200">
      {states.map((item, index) => {
        const isCompletedOrCurrent = index <= current;

        return (
          <div key={item} className="relative flex gap-4 items-center z-10">
            <div
              className={`
                w-4
                h-4
                rounded-full
                transition-all
                duration-300
                border-2
                ${
                  isCompletedOrCurrent
                    ? "bg-[#472D20] border-[#472D20] scale-110 shadow-sm"
                    : "bg-white border-stone-300"
                }
              `}
            />

            <p
              className={`text-sm ${isCompletedOrCurrent ? "text-[#472D20] font-semibold" : "text-stone-400"}`}
            >
              {labelMap[item]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
