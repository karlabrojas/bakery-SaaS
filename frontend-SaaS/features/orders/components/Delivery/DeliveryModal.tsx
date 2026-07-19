"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button"; // Reemplaza por tu botón UI real si aplica
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
  // Opcional: Si el botón de guardar está FUERA del formulario (en el pie del modal),
  // podemos capturar el estado interno de igual manera usando onChange
  const [localData, setLocalData] = useState<any>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-[#472D20]">
          {delivery ? "Editar entrega" : "Nueva entrega"}
        </h2>

        <DeliveryForm
          initialData={delivery}
          onChange={(data) => setLocalData(data)} // 👈 Mantiene actualizado a DeliveryModal por si se guarda por fuera
          onSubmit={onSubmit} // 👈 Sigue soportando submit directo por si hay un botón tipo submit
        />

        {/* Pie del modal con botón de acción si tu UI lo requiere */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-200 rounded-xl text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onSubmit(localData || delivery)} // 👈 Ejecuta la acción al hacer clic
            className="px-4 py-2 bg-[#472D20] text-white rounded-xl text-sm font-medium"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
