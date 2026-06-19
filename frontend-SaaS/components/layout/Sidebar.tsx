"use client";

import { X, ShoppingCart, Package, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = [
    {
      name: "Ventas",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Inventario",
      href: "/inventory",
      icon: Package,
    },
    {
      name: "Pedidos",
      href: "/orders",
      icon: ClipboardList,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#5A2E1F] text-[#F8F1E4] z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors text-[#F8F1E4]/80 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="flex flex-col items-center px-6 pb-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-full bg-[#E8D6AF] shadow-inner ring-4 ring-[#E8D6AF]/20" />
            <h2 className="text-xl font-bold mt-4 tracking-wide">Usuario</h2>
            <p className="text-xs font-medium uppercase tracking-wider text-[#E8D6AF]/80 mt-1">
              Perfil Administrador
            </p>
          </div>

          {/* Section Heading */}
          <div className="px-6 pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E8D6AF]/60">
              Dashboard
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#EAD9B6] text-[#6B3118] shadow-md font-semibold"
                      : "text-[#F8F1E4]/90 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-[#6B3118]"
                        : "text-[#F8F1E4]/70 group-hover:text-white transition-colors"
                    }
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Brand (Opcional, añade estructura visual premium) */}
        <div className="p-4 text-center border-t border-white/5 bg-black/10">
          <p className="text-xs text-[#E8D6AF]/40 tracking-widest font-mono"></p>
        </div>
      </aside>
    </>
  );
}
