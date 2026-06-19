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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#FBEACE] border border-[#B8926B]/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-5 transform transition-all scale-100">
        <div className="space-y-2">
          <h2 className="text-red-700 font-extrabold text-xl tracking-tight flex items-center gap-2">
            Eliminar venta
          </h2>
          <p className="text-sm text-stone-700 font-medium leading-relaxed">
            ¿Está seguro de que desea eliminar esta venta de forma permanente?
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="w-full h-11 text-sm font-medium border border-stone-300"
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            className="w-full h-11 text-sm font-semibold shadow-sm bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
