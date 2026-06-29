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
    <div className="w-full space-y-6">
      <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-white">Confirmar Pago</h2>
        <p className="text-sm text-[#FBEACE] mt-1 leading-normal">
          Selecciona el método de pago para finalizar la venta.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm">
          <p className="uppercase tracking-wider text-xs font-bold text-stone-500">
            Total a cobrar
          </p>
          <p className="text-3xl font-black text-[#472D20] mt-1">
            $
            {total.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
            Método de pago
          </label>
          <PaymentMethods selectedMethod={method} onSelect={setMethod} />
        </div>

        {method === "Efectivo" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Dinero recibido
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                placeholder="0.00"
                className="h-14 text-xl text-center font-bold w-full"
              />
            </div>

            <div
              className={`rounded-2xl border p-5 transition ${
                invalidCash && received
                  ? "bg-red-50 border-red-200"
                  : "bg-[#FBEACE] border-[#B8926B]/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-700">
                  {change >= 0 ? "Cambio" : "Falta por pagar"}
                </span>
                <span
                  className={`text-2xl font-black ${
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

      <div className="border-t border-stone-200/80 pt-5">
        <Button
          className="w-full h-14 text-lg font-bold"
          disabled={loading || invalidCash}
          onClick={handleConfirm}
        >
          {loading ? "Procesando venta..." : "Confirmar Venta"}
        </Button>
      </div>
    </div>
  );
}
