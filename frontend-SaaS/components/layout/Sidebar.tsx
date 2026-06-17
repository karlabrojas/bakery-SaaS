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
      <div
        onClick={onClose}
        className={`
            fixed inset-0
            z-40
            transition-opacity duration-300

            ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
            `}
      />

      <aside
        className={`
            fixed
            top-0
            left-0
            h-screen
            w-80
            bg-[#5A2E1F]
            text-[#F8F1E4]
            z-50
            transform
            transition-transform
            duration-300

            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="flex justify-end p-5">
          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-[#E8D6AF]" />

          <h2 className="text-4xl mt-6 font-serif">Usuario</h2>

          <p className="text-2xl mt-3 font-serif">Perfil</p>
        </div>

        <div className=" pl-16 mt-12 mb-12">
          <p className="text-2xl font-serif">Dashboard</p>
        </div>

        <nav className="space-y-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
            flex
            items-center
            gap-4
            py-5
            pl-8
            text-2xl
            font-serif
            transition-all

            ${
              isActive
                ? "bg-[#EAD9B6] text-[#6B3118] rounded-l-full"
                : "text-[#F8F1E4] hover:bg-[#6B3118]"
            }
            `}
              >
                <Icon size={24} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
