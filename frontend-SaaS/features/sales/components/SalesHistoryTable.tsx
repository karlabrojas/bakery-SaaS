"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import EditSaleModal from "./EditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { getSales, deleteSale } from "../services/api";
import {
  Pencil,
  Trash2,
  Calendar,
  FileText,
  DollarSign,
  CreditCard,
} from "lucide-react";

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
      <div className="p-8 text-center rounded-xl bg-[#FFF8E0] border-2 border-dashed border-[#B8926B]">
        <p className="text-sm font-semibold text-[#8C6D53]">
          No hay ventas registradas en el historial.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-[#FFF8E0] rounded-xl shadow-md border-2 border-[#B8926B]">
        <Table
          headers={["Fecha", "Folio", "Total", "Método de Pago", "Acciones"]}
        >
          {sales.map((sale, index) => {
            if (!sale || !sale.id) {
              return (
                <tr key={index}>
                  <td
                    colSpan={5}
                    className="text-red-600 p-4 text-center text-sm font-semibold bg-[#FFF8E0]"
                  >
                    Registro de venta inválido
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={sale.id}
                className="border-b border-[#EAD9B6] last:border-none hover:bg-[#FBEACE]/50 transition-colors"
              >
                {/* Fecha */}
                <td className="px-6 py-4 text-sm text-[#5A2E1F] font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#8C6D53]" />
                    <span>
                      {sale.created_at
                        ? new Date(sale.created_at).toLocaleDateString("es-MX")
                        : "Sin fecha"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FBEACE] border border-[#B8926B] text-xs font-mono font-bold text-[#472D20]">
                    <FileText size={14} className="text-[#8C6D53]" />
                    {sale.id.substring(0, 8).toUpperCase()}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-bold text-[#472D20] font-mono">
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-[#8C6D53]" />
                    <span>{sale.total_amount ?? 0}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-[#5A2E1F]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEACE] border border-[#B8926B] text-xs font-semibold text-[#472D20] capitalize">
                    <CreditCard size={14} className="text-[#8C6D53]" />
                    {sale.payment_method ?? "Sin método"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-[#EAD9B6] text-stone-700 rounded-lg transition-colors border border-[#D9C3A9] shadow-xs"
                    >
                      <Pencil size={14} className="text-[#8C6D53]" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDelete(sale)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 shadow-xs"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
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
