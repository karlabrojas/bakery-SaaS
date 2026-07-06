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
              rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer
              active:scale-[0.97] select-none
              ${
                isSelected
                  ? "border-[#6B3118] bg-[#EAD9B6] text-[#6B3118] shadow-md font-bold"
                  : "border-[#B8926B]/40 bg-[#FBEACE] text-[#5A2E1F] hover:border-[#B8926B]"
              }
            `}
          >
            <Icon
              size={26}
              className={
                isSelected ? "scale-110 transition-transform" : "opacity-80"
              }
            />
            <span className="text-sm font-medium tracking-wide">
              {method.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
