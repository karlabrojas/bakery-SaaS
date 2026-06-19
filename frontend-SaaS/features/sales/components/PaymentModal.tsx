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
  const [cargando, setCargando] = useState(false);

  const change = Number(received || 0) - total;

  const esEfectivoInvalido =
    method === "Efectivo" && (Number(received) < total || !received);

  const handleConfirm = async () => {
    setCargando(true);
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
      setCargando(false);
    }
  };

  return (
    <div className="space-y-5 p-1">
      <div>
        <h2 className="text-xl font-bold text-[#472D20]">Finalizar Pago</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Selecciona el método con el que pagará el cliente.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-stone-600 tracking-wider">
          Método de pago
        </label>
        <PaymentMethods selectedMethod={method} onSelect={setMethod} />
      </div>

      <div className="flex justify-between items-center bg-white/60 border border-stone-200 p-4 rounded-xl shadow-sm">
        <span className="text-stone-600 font-semibold text-sm">
          Monto Total a Cobrar:
        </span>
        <span className="text-2xl font-black text-[#472D20] font-mono">
          ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {method === "Efectivo" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 tracking-wider block">
              Dinero recibido
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-mono font-bold text-lg">
                $
              </span>
              <Input
                type="number"
                min="0"
                step="any"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 h-12 text-lg font-mono bg-white border-stone-300 focus:border-[#472D20]"
                autoFocus
              />
            </div>
          </div>

          <div
            className={`flex justify-between items-center border p-4 rounded-xl shadow-sm transition-colors duration-200 ${
              esEfectivoInvalido && received
                ? "bg-red-50/60 border-red-200"
                : "bg-[#FBEACE]/40 border-[#B8926B]/20"
            }`}
          >
            <span className="text-stone-600 font-semibold text-sm">
              {change < 0 ? "Falta por pagar:" : "Cambio para el cliente:"}
            </span>
            <span
              className={`text-xl font-bold font-mono ${
                change < 0 && received ? "text-red-600" : "text-[#472D20]"
              }`}
            >
              $
              {Math.abs(change).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          className="w-full h-12 text-base font-semibold shadow-md active:scale-[0.99] transition-transform"
          onClick={handleConfirm}
          disabled={cargando || esEfectivoInvalido}
        >
          {cargando ? "Procesando venta..." : "Confirmar Venta"}
        </Button>
      </div>
    </div>
  );
}
