"use client";

import Button from "@/components/ui/Button";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  title,
  message,
  confirmText = "Eliminar",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#FFFCF5] border border-[#B8926B]/30 shadow-2xl overflow-hidden">
        <div className="bg-[#472D20] px-6 py-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="p-6">
          <p className="text-sm leading-6 text-stone-700">{message}</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-stone-200 bg-stone-50">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 text-base"
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 text-base"
          >
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
