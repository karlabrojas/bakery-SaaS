"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import EditSaleModal from "./EditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { getSales, deleteSale } from "../services/api";

interface Sale {
  id: string;
  created_at?: string;
  total_amount?: number;
  payment_method?: string;
}

export default function SalesHistoryTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    getSales()
      .then((data) => {
        console.log("Respuesta de getSales:", data);
        const clean: Sale[] = Array.isArray(data)
          ? data.filter(
              (s): s is Sale =>
                !!s && typeof s.id === "string" && s.id.trim() !== "",
            )
          : [];
        setSales(clean);
      })
      .catch(console.error);
  }, []);

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setOpenEdit(true);
  };

  const handleDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedSale) return;

    setLoadingDelete(true);
    try {
      await deleteSale(selectedSale.id);
      setSales((prev) => prev.filter((s) => s.id !== selectedSale.id));
      setOpenDelete(false);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (sales.length === 0) {
    return <p className="text-gray-500">No hay ventas registradas.</p>;
  }

  return (
    <>
      <Table headers={["Fecha", "Folio", "Total", "Pago", "Acciones"]}>
        {sales.map((sale, index) => {
          if (!sale || !sale.id) {
            return (
              <tr key={index}>
                <td colSpan={5} className="text-red-500">
                  Venta inválida
                </td>
              </tr>
            );
          }

          return (
            <tr
              key={sale.id}
              className="border-b border-[#472D20] hover:bg-gray-50/70 transition-colors"
            >
              <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                {sale.created_at
                  ? new Date(sale.created_at).toLocaleDateString()
                  : "Sin fecha"}
              </td>

              <td className="px-4 py-4 text-sm font-mono font-semibold text-gray-700 align-middle">
                {sale.id.substring(0, 8).toUpperCase()}
              </td>

              <td className="px-4 py-4 text-sm font-bold text-gray-900 align-middle">
                ${sale.total_amount ?? 0}
              </td>

              <td className="px-4 py-4 text-sm text-gray-600 capitalize align-middle">
                {sale.payment_method ?? "Sin método"}
              </td>

              <td className="px-4 py-4 text-sm flex items-center gap-3 align-middle">
                <button
                  onClick={() => handleEdit(sale)}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(sale)}
                  className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </Table>

      {/* EDIT */}
      <EditSaleModal
        open={openEdit}
        sale={selectedSale}
        onClose={() => setOpenEdit(false)}
        onUpdated={(updated) => {
          setSales((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
          );
        }}
      />

      {/* DELETE */}
      <ConfirmDeleteModal
        open={openDelete}
        loading={loadingDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
