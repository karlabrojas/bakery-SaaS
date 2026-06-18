import { Banknote, CreditCard, ArrowLeftRight } from "lucide-react";

interface Props {
  selectedMethod: "Efectivo" | "Tarjeta" | "Transferencia";

  onSelect: (method: "Efectivo" | "Tarjeta" | "Transferencia") => void;
}

export default function PaymentMethods({ selectedMethod, onSelect }: Props) {
  const methods = [
    {
      value: "Efectivo",
      label: "Efectivo",
      icon: Banknote,
    },
    {
      value: "Tarjeta",
      label: "Tarjeta",
      icon: CreditCard,
    },
    {
      value: "Transferencia",
      label: "Transferencia",
      icon: ArrowLeftRight,
    },
  ];

  return (
    <div className="flex gap-3">
      {methods.map((method) => {
        const Icon = method.icon;

        return (
          <button
            key={method.value}
            onClick={() =>
              onSelect(method.value as "Efectivo" | "Tarjeta" | "Transferencia")
            }
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-2
              flex-1
              rounded-xl
              border-4
              p-4
              transition-all

              ${
                selectedMethod === method.value
                  ? "border-[#6B3118] bg-[#EAD9B6]"
                  : "border-[#B8926B] bg-[#FBEACE]"
              }
            `}
          >
            <Icon size={32} />

            <span className="font-medium">{method.label}</span>
          </button>
        );
      })}
    </div>
  );
}
