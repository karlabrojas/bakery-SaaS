"use client";

import SalesHistoryTable from "@/features/sales/components/SalesHistoryTable";

export default function HistoryPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Historial de Ventas</h1>

      <SalesHistoryTable />
    </>
  );
}
