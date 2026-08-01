"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PaymentMethods from "./PaymentMethods";

interface PaymentModalProps {
  total: number;
  onConfirm: (data: {
    paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";
    received?: number;
    change?: number;
  }) => Promise<void>;
}

export default function PaymentModal({ total, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<
    "Efectivo" | "Tarjeta" | "Transferencia"
  >("Efectivo");

  const [received, setReceived] = useState("");
  const [loading, setLoading] = useState(false);

  const change = Number(received || 0) - total;

  const invalidCash =
    method === "Efectivo" && (!received || Number(received) < total);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (method === "Efectivo") {
        await onConfirm({
          paymentMethod: "Efectivo",
          received: Number(received),
          change: Math.max(0, change),
        });
      } else {
        await onConfirm({
          paymentMethod: method,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-white rounded-2xl p-6 shadow-2xl">
      <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Confirmar Pago
        </h2>
        <p className="text-xs text-[#FBEACE] mt-1 leading-normal">
          Selecciona el método de pago para finalizar la venta.
        </p>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-[#D9C3A9] p-4 text-center shadow-xs">
          <p className="uppercase tracking-wider text-xs font-bold text-[#7C5A42]">
            Total a cobrar
          </p>
          <p className="text-3xl font-extrabold text-[#472D20] mt-1 font-mono">
            $
            {total.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-[#7C5A42] tracking-wider">
            Método de pago
          </label>
          <PaymentMethods selectedMethod={method} onSelect={setMethod} />
        </div>

        {method === "Efectivo" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#7C5A42] tracking-wider">
                Dinero recibido
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                placeholder="0.00"
                className="h-12 text-xl text-center font-bold w-full bg-white border-[#D9C3A9] text-[#472D20] rounded-xl focus:border-[#472D20]"
              />
            </div>

            <div
              className={`rounded-2xl border p-4 transition ${
                invalidCash && received
                  ? "bg-red-50 border-red-200"
                  : "bg-[#FAF4ED] border-[#D9C3A9]"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C5A42]">
                  {change >= 0 ? "Cambio" : "Falta por pagar"}
                </span>
                <span
                  className={`text-2xl font-black font-mono ${
                    change >= 0 ? "text-[#472D20]" : "text-red-600"
                  }`}
                >
                  $
                  {Math.abs(change).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#D9C3A9] pt-4">
        <Button
          className="w-full h-12 text-sm font-bold bg-[#472D20] hover:bg-[#3B281A] text-white rounded-xl shadow-sm transition-colors"
          disabled={loading || invalidCash}
          onClick={handleConfirm}
        >
          {loading ? "Procesando venta..." : "Confirmar Venta"}
        </Button>
      </div>
    </div>
  );
}
