interface Props {
  total: number;
  advance: number;
}

export default function PaymentSummaryCard({ total, advance }: Props) {
  const remaining = Math.max(total - advance, 0);

  return (
    <div className="bg-[#FBEACE] rounded-xl p-4 space-y-3 border border-[#EAD9B6]">
      <h3 className="font-bold text-[#472D20]">Resumen de pago</h3>

      <div className="flex justify-between text-sm">
        <span>Total del pedido</span>

        <span className="font-semibold">${total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Anticipo</span>

        <span className="font-semibold text-green-700">
          ${advance.toFixed(2)}
        </span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-lg">
        <span>Saldo pendiente</span>

        <span className="text-red-600">${remaining.toFixed(2)}</span>
      </div>
    </div>
  );
}
