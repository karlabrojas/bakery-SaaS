import React, { useState, useEffect } from "react";
import { Order } from "../types/order.type";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>; // 👈 Asegúrate de que esta línea exista
  order: Order | null; // Recibe la orden a editar
}

export default function EditOrderModal({
  isOpen,
  onClose,
  onSuccess, // 👈 Desestructuras onSuccess
  order,
}: EditOrderModalProps) {
  const [loading, setLoading] = useState(false);

  // ... Tus estados para controlar los campos del formulario (ej. status, items, etc.)

  // Efecto para cargar los datos de la orden cuando el modal se abre con una orden seleccionada
  useEffect(() => {
    if (isOpen && order) {
      // Cargar los datos de la orden en tus estados locales
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 🚀 Aquí ejecutas la petición HTTP para actualizar (PUT/PATCH)
      // await updateOrderService(order.id, datosModificados);

      await onSuccess(); // 👈 Llama a onSuccess para refrescar la tabla OrdersTable
      onClose(); // 👈 Cierra el modal
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Tu diseño del formulario de edición aquí */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#472D20]">
            Editar Pedido: {order.folio}
          </h2>

          {/* ... Campos del formulario ... */}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#472D20] text-white rounded-xl"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
