"use client";

import {
  X,
  ShoppingCart,
  Package,
  ClipboardList,
  Croissant,
  UserCircle,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { authService } from "@/features/auth/services/auth.service";
import { useProfile } from "@/features/profile/hooks/useProfile";
import Avatar from "@/features/profile/components/Avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const { user, bakery, loading } = useProfile();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Ventas",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Productos",
      href: "/products",
      icon: Croissant,
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
    {
      name: "Mi Perfil",
      href: "/profile",
      icon: UserCircle,
    },
  ];

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") || "";

      await authService.logout(accessToken);

      localStorage.removeItem("accessToken");

      window.location.href = "/";
    } catch (error: any) {
      console.error(error);

      alert(error.message ?? "No fue posible cerrar la sesión.");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#5A2E1F] text-[#F8F1E4] z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors text-[#F8F1E4]/80 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-col items-center px-6 pb-6 border-b border-white/10">
            {loading ? (
              <Loader2 className="animate-spin" size={34} />
            ) : (
              <>
                <Avatar
                  logoUrl={bakery?.logoUrl ?? null}
                  bakeryName={bakery?.name ?? ""}
                  size={84}
                />

                <h2 className="text-lg font-bold mt-5 text-center">
                  {bakery?.name ?? "Panadería"}
                </h2>

                <p className="text-sm text-[#EAD9B6] mt-1 text-center">
                  {user ? `${user.first_name} ${user.last_name}` : ""}
                </p>

                <span className="mt-2 px-3 py-1 rounded-full bg-[#EAD9B6] text-[#6B3118] text-xs font-bold uppercase tracking-wider">
                  {user?.role ?? ""}
                </span>
              </>
            )}
          </div>

          <div className="px-6 pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E8D6AF]/60">
              Menú Principal
            </p>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

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

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 bg-black/10 p-4">
          {!loading && user && (
            <div className="mb-4 rounded-lg bg-white/5 p-3">
              <p className="text-xs uppercase tracking-widest text-[#E8D6AF]/70">
                Sesión iniciada
              </p>

              <p className="mt-1 text-sm font-medium break-words">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-[#EAD9B6] py-2.5 px-4 font-semibold text-[#6B3118] transition-colors hover:bg-[#DCC48E]"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
