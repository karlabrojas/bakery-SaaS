"use client";

import Modal from "@/components/ui/Modal";
import DeliveryForm from "./DeliveryForm";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  delivery?: any;
  loading?: boolean;
}

export default function DeliveryModal({
  isOpen,
  onClose,
  onSubmit,
  delivery,
  loading,
}: Props) {
  const [localData, setLocalData] = useState<any>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="overflow-hidden rounded-2xl bg-[#FAF6E9]">
        <div className="bg-[#472D20] text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {delivery ? "Editar Entrega" : "Programar Envío"}
            </h2>
            <p className="text-xs text-[#EAD9B6] mt-1">
              Completa la información logística para el envío del pedido.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl transition-colors font-light"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ⚡ Cambios aplicados: limpieza de props y simplificación de onChange */}
          <DeliveryForm initialData={delivery} onChange={setLocalData} />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAD9B6]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-stone-300 hover:bg-stone-100 transition-colors rounded-xl text-sm font-medium text-stone-700 bg-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmit(localData || delivery)}
              className="px-5 py-2.5 bg-[#472D20] hover:bg-[#362117] text-white disabled:bg-stone-400 transition-colors rounded-xl text-sm font-semibold shadow-sm"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
