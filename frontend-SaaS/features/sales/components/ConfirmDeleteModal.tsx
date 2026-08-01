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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#D9C3A9] shadow-xl overflow-hidden">
        <div className="bg-[#472D20] px-6 py-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>

        <div className="p-6">
          <p className="text-xs leading-relaxed text-[#7C5A42]">{message}</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#D9C3A9] bg-[#FAF4ED]">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs bg-white border border-[#D9C3A9] text-[#472D20] hover:bg-[#FAF4ED] rounded-xl"
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
          >
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
