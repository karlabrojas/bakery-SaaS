"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PaymentMethods from "./PaymentMethods";

interface PaymentModalProps {
  total: number;

  onConfirm: (data: {
    paymentMethod: "cash" | "card" | "transfer";

    received?: number;

    change?: number;
  }) => void;
}

export default function PaymentModal({ total, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("cash");

  const [received, setReceived] = useState("");

  const change = Number(received || 0) - total;

  const handleConfirm = () => {
    if (method === "cash") {
      onConfirm({
        paymentMethod: "cash",
        received: Number(received),
        change: Math.max(0, change),
      });

      return;
    }

    onConfirm({
      paymentMethod: method,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Método de Pago</h2>

      <PaymentMethods selectedMethod={method} onSelect={setMethod} />

      <div
        className="
          rounded-xl
          border-2
          border-[#B8926B]
          p-4
        "
      >
        <div className="flex justify-between">
          <span>Total</span>

          <span className="font-bold">${total}</span>
        </div>
      </div>

      {method === "cash" && (
        <>
          <div>
            <label className="mb-2 block">Dinero recibido</label>

            <Input
              type="number"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="0.00"
              className="w-full"
            />
          </div>

          <div
            className="
              rounded-xl
              border-2
              border-[#B8926B]
              p-4
            "
          >
            <div className="flex justify-between">
              <span>Cambio</span>

              <span className="font-bold">${Math.max(0, change)}</span>
            </div>
          </div>
        </>
      )}

      <Button className="w-full" onClick={handleConfirm}>
        Confirmar Venta
      </Button>
    </div>
  );
}
