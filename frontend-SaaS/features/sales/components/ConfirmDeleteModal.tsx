"use client";

import Button from "@/components/ui/Button";

export default function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading,
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#FBEACE] p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-red-600 font-bold text-xl">Eliminar venta</h2>

        <p>¿Seguro que quieres eliminar esta venta?</p>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel} className="w-full">
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
