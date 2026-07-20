"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PaymentMethod } from "../../types/payment.type";

interface Props {
  amount: number;
  setAmount: (value: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  reference: string;
  setReference: (value: string) => void;
  observations: string;
  setObservations: (value: string) => void;
}

export default function AdvancePaymentForm({
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  reference,
  setReference,
  observations,
  setObservations,
}: Props) {
  // Estado local para alternar la visibilidad del bloque de anticipo
  const [hasAdvance, setHasAdvance] = useState(amount > 0);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setHasAdvance(checked);
    if (!checked) {
      // Limpiar valores si el usuario decide quitar el anticipo
      setAmount(0);
      setReference("");
      setObservations("");
    }
  };

  // Evita el bug del '01220' evaluando correctamente el string antes de mutarlo a número
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === "" || valStr === "0") {
      setAmount(0);
    } else {
      setAmount(Number(valStr));
    }
  };

  return (
    <div className="space-y-4">
      {/* Interruptor para desplegar */}
      <label className="flex items-center gap-3 cursor-pointer p-1">
        <input
          type="checkbox"
          checked={hasAdvance}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-stone-300 text-[#472D20] focus:ring-[#472D20]"
        />
        <span className="text-sm font-semibold text-stone-700">
          ¿El cliente dejará un anticipo / pago inicial?
        </span>
      </label>

      {hasAdvance && (
        <div className="space-y-5 border border-stone-200 rounded-xl p-5 bg-white shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-[#472D20] text-base">
            Detalle del Anticipo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                Monto
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amount === 0 ? "" : amount} // Evita mostrar un cero fijo al iniciar a escribir
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                Método de pago
              </label>
              <Select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-full"
              >
                <option value={PaymentMethod.CASH}>Efectivo</option>
                <option value={PaymentMethod.CARD}>Tarjeta</option>
                <option value={PaymentMethod.TRANSFER}>Transferencia</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                Referencia (Opcional)
              </label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej. # Transacción o Autorización"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                Observaciones del pago
              </label>
              <Input
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ej. Dejó billete de $500"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
