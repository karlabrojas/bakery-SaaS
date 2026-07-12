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

  onClose: () => void;

  onConfirm: () => void;
  
  error?: string
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  variant = "danger",
  error,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#472D20]">{title}</h2>

          <p className="mt-3 text-[#5A2E1F]">{message}</p>

          <p className="mt-2 text-sm text-red-500">
            Esta acción no podrá deshacerse.
          </p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          {!error && (
            <Button variant={variant} onClick={onConfirm} disabled={loading}>
              {loading ? "Procesando..." : confirmText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
