"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
  errorMessage?: string; // ✅ nueva prop
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  loading = false,
  variant = "danger",
  errorMessage, // ✅ recibimos la prop
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#472D20]">{title}</h2>

          <p className="mt-3 text-[#5A2E1F]">{message}</p>

          {errorMessage && ( // ✅ renderizamos si existe
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
