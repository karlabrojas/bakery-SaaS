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
        className="fixed inset-0 bg-[#472D20]/40 backdrop-blur-xs z-40 transition-opacity"
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
          shadow-xl
          border-2
          border-[#B8926B]
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
            w-8
            h-8
            rounded-full
            bg-[#FBEACE]
            hover:bg-[#EAD9B6]
            text-[#472D20]
            border
            border-[#B8926B]
            flex
            items-center
            justify-center
            transition-colors
          "
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {children}
      </div>
    </>
  );
}
