import { PaymentMethod } from "../../types/payment.type";

interface Props {
  method: PaymentMethod;
}

const config: Record<
  PaymentMethod,
  {
    label: string;
    className: string;
  }
> = {
  CASH: {
    label: "Efectivo",
    className: "bg-green-100 text-green-700",
  },
  CARD: {
    label: "Tarjeta",
    className: "bg-blue-100 text-blue-700",
  },
  TRANSFER: {
    label: "Transferencia",
    className: "bg-purple-100 text-purple-700",
  },
};

export default function PaymentMethodBadge({ method }: Props) {
  const payment = config[method];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.className}`}
    >
      {payment.label}
    </span>
  );
}
