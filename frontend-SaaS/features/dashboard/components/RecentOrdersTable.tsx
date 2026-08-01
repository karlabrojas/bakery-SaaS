import { RecentOrder } from "../types/dashboard.type";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";

interface Props {
  orders: RecentOrder[];
}

export default function RecentOrdersTable({ orders }: Props) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#B8926B] shadow-md p-6">
      <h2 className="font-bold text-lg text-[#472D20] mb-5">
        Pedidos recientes
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-[#8C6D53] italic py-4 text-center">
          No tienes pedidos recientes registrados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-[#B8926B] text-[#472D20] text-sm font-bold bg-[#FBEACE]">
                <th className="py-3 px-4 rounded-l-lg">Folio</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 rounded-r-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAD9B6] text-[#5A2E1F]">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#FBEACE]/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#472D20]">
                    {order.folio}
                  </td>
                  <td className="py-3.5 px-4">
                    {order.customer?.name ?? "Cliente"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#472D20]">
                    ${order.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
