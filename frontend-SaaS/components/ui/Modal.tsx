"use client";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="
          fixed
          inset-0
          bg-black/50
          z-40
        "
        onClick={onClose}
      />

      <div
        className="
          fixed
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          z-50
          w-[90%]
          max-w-md
          rounded-xl
          bg-[#FBEACE]
          p-6
          shadow-lg
        "
      >
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        {children}
      </div>
    </>
  );
}
