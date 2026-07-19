"use client";

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
  return (
    <div className="space-y-5 border border-stone-200 rounded-xl p-5">
      <h3 className="font-bold text-[#472D20] text-lg">Anticipo</h3>

      <div>
        <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
          Monto
        </label>

        <Input
          type="number"
          min={0}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
          Método de pago
        </label>

        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        >
          <option value={PaymentMethod.CASH}>Efectivo</option>

          <option value={PaymentMethod.CARD}>Tarjeta</option>

          <option value={PaymentMethod.TRANSFER}>Transferencia</option>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
          Referencia
        </label>

        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Número de referencia"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
          Observaciones
        </label>

        <Input
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observaciones"
        />
      </div>
    </div>
  );
}
