import { RecentOrder } from "../types/dashboard.type";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";

interface Props {
  orders: RecentOrder[];
}

export default function RecentOrdersTable({ orders }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold mb-5">Pedidos recientes</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th>Folio</th>

            <th>Cliente</th>

            <th>Total</th>

            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.folio}</td>

              <td>{order.customer?.name ?? "Cliente"}</td>

              <td>${order.total}</td>

              <td>
                <OrderStatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
