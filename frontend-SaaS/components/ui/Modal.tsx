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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
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
          w-[95%]
          max-w-md
          rounded-2xl
          bg-[#FFF8E0]
          p-6
          shadow-2xl
          border
          border-[#EAD9B6]
          overflow-hidden
        "
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="
            absolute
            top-4
            right-4
            z-10
            w-9
            h-9
            rounded-full
            bg-white/10
            hover:bg-white/20
            text-white
            flex
            items-center
            justify-center
            transition-colors
            backdrop-blur-sm
          "
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {children}
      </div>
    </>
  );
}
