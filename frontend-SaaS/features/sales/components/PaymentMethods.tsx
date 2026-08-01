"use client";

import { Banknote, CreditCard, ArrowLeftRight } from "lucide-react";

interface Props {
  selectedMethod: "Efectivo" | "Tarjeta" | "Transferencia";
  onSelect: (method: "Efectivo" | "Tarjeta" | "Transferencia") => void;
}

export default function PaymentMethods({ selectedMethod, onSelect }: Props) {
  const methods = [
    { value: "Efectivo", label: "Efectivo", icon: Banknote },
    { value: "Tarjeta", label: "Tarjeta", icon: CreditCard },
    { value: "Transferencia", label: "Transferencia", icon: ArrowLeftRight },
  ];

  return (
    <div className="flex gap-3 w-full">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.value;

        return (
          <button
            key={method.value}
            type="button"
            onClick={() =>
              onSelect(method.value as "Efectivo" | "Tarjeta" | "Transferencia")
            }
            className={`
              flex flex-col items-center justify-center gap-2 flex-1 
              rounded-2xl p-4 border transition-all duration-200 cursor-pointer
              active:scale-[0.97] select-none shadow-xs
              ${
                isSelected
                  ? "border-2 border-[#472D20] bg-[#F5EBE0] text-[#472D20] font-bold shadow-sm"
                  : "border-[#D9C3A9] bg-[#FAF4ED] text-[#7C5A42] hover:border-[#472D20]/50 hover:bg-[#F5EBE0]/50"
              }
            `}
          >
            <Icon
              size={24}
              className={
                isSelected
                  ? "text-[#472D20] scale-110 transition-transform"
                  : "text-[#8C6D53]"
              }
            />
            <span className="text-xs font-semibold tracking-wide">
              {method.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
