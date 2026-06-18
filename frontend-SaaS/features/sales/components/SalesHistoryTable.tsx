"use client";

import { useEffect, useState } from "react";

import Table from "@/components/ui/Table";

import { getSales } from "../services/api";

export default function SalesHistoryTable() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    getSales().then(setSales);
  }, []);

  return (
    <Table headers={["Fecha", "Folio", "Total", "Pago"]}>
      {sales.map((sale) => (
        <tr key={sale.id}>
          <td>{new Date(sale.created_at).toLocaleDateString()}</td>

          <td>{sale.id.substring(0, 8).toUpperCase()}</td>

          <td>${sale.total_amount}</td>

          <td>{sale.payment_method}</td>
        </tr>
      ))}
    </Table>
  );
}
