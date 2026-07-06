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
    return (
      <div className="p-8 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200">
        <p className="text-sm font-medium text-stone-400">
          No hay ventas registradas en el historial.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-stone-100">
        <Table headers={["Fecha", "Folio", "Total", "Pago", "Acciones"]}>
          {sales.map((sale, index) => {
            if (!sale || !sale.id) {
              return (
                <tr key={index}>
                  <td
                    colSpan={5}
                    className="text-red-500 p-4 text-center text-sm font-semibold"
                  >
                    Registro de venta inválido
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={sale.id}
                className="border-b border-stone-100 last:border-none hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3.5 text-sm text-stone-600 font-medium">
                  {sale.created_at
                    ? new Date(sale.created_at).toLocaleDateString()
                    : "Sin fecha"}
                </td>

                <td className="px-4 py-3.5 text-xs font-mono font-bold text-[#472D20] bg-[#472D20]/5 rounded-md inline-block my-2">
                  {sale.id.substring(0, 8).toUpperCase()}
                </td>

                <td className="px-4 py-3.5 text-sm font-bold text-stone-900 font-mono">
                  ${sale.total_amount ?? 0}
                </td>

                <td className="px-4 py-3.5 text-sm text-stone-600">
                  <span className="capitalize px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                    {sale.payment_method ?? "Sin método"}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-[#6B3118] rounded-lg transition-colors border border-stone-200"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(sale)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

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

      <ConfirmDeleteModal
        open={openDelete}
        title="Eliminar venta"
        message={`¿Está seguro de que desea eliminar la venta ${
          selectedSale
            ? `con folio ${selectedSale.id.substring(0, 8).toUpperCase()}`
            : ""
        }? Esta acción no se puede deshacer.`}
        confirmText="Eliminar venta"
        loading={loadingDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
