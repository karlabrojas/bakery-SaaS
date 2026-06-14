"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onOpen: () => void;
}

export default function Header({ onOpen }: HeaderProps) {
  return (
    <header className="h-20 bg-[#F8F1E4] flex items-center px-5 shadow-sm">
      <button
        onClick={onOpen}
        className="
          bg-[#472D20]
          text-[#FBEACE]
          p-3
          rounded-xl
        "
      >
        <Menu size={28} />
      </button>
    </header>
  );
}
