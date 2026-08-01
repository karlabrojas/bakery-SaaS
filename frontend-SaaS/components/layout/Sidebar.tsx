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
  LogOut,
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

  const isProfileActive =
    pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#5A2E1F] text-[#F8F1E4] z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors text-[#F8F1E4]/80 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6 custom-scrollbar">
          <div className="flex flex-col items-center pb-5 border-b border-white/10">
            {loading ? (
              <div className="py-6">
                <Loader2 className="animate-spin text-[#EAD9B6]" size={34} />
              </div>
            ) : (
              <>
                <Avatar
                  logoUrl={bakery?.logoUrl ?? null}
                  bakeryName={bakery?.name ?? ""}
                  size={72}
                />

                <h2 className="text-base font-bold mt-3 text-center line-clamp-1">
                  {bakery?.name ?? "Panadería"}
                </h2>

                <p className="text-xs text-[#EAD9B6] mt-0.5 text-center line-clamp-1">
                  {user ? `${user.first_name} ${user.last_name}` : ""}
                </p>

                <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#EAD9B6] text-[#6B3118] text-[10px] font-bold uppercase tracking-wider">
                  {user?.role ?? ""}
                </span>
              </>
            )}
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8D6AF]/60 mb-3 px-2">
              Menú Principal
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-[#EAD9B6] text-[#6B3118] shadow-md font-semibold"
                        : "text-[#F8F1E4]/90 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={19}
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
        </div>

        <div className="border-t border-white/10 bg-black/15 p-4 shrink-0 space-y-3">
          <Link
            href="/profile"
            onClick={onClose}
            className={`flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-lg transition-all ${
              isProfileActive
                ? "bg-[#EAD9B6] text-[#6B3118] shadow-md font-semibold"
                : "bg-white/5 text-[#F8F1E4]/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <UserCircle
              size={19}
              className={isProfileActive ? "text-[#6B3118]" : "text-[#EAD9B6]"}
            />
            <span>Mi Perfil y Cuenta</span>
          </Link>

          {!loading && user && (
            <div className="rounded-lg bg-black/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-[#E8D6AF]/70 font-semibold">
                Sesión iniciada
              </p>
              <p
                className="text-xs font-medium truncate mt-0.5"
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#EAD9B6] py-2 px-4 text-xs font-bold text-[#6B3118] transition-colors hover:bg-[#DCC48E] shadow-sm"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
