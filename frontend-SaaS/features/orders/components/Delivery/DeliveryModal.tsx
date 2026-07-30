"use client";

import DeliveryForm from "./DeliveryForm";
import Button from "../../../../components/ui/Button";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[560px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="bg-[#472D20] px-6 py-5 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {delivery ? "Editar Entrega" : "Programar Envío"}
            </h2>
            <p className="text-xs text-[#FBEACE] mt-1">
              Completa la información logística para el envío del pedido.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl font-bold p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <DeliveryForm initialData={delivery} onChange={setLocalData} />
        </div>

        <div className="border-t border-stone-100 bg-white px-6 py-4 flex justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="!px-5 !py-2 !text-sm !bg-white !text-stone-700 !border !border-stone-300 hover:!bg-stone-50"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={loading}
            onClick={() => onSubmit(localData || delivery)}
            className="!px-5 !py-2 !text-sm shadow-sm"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
