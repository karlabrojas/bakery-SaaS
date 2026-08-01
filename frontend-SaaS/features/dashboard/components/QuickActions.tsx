"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, ClipboardList, Package, Users } from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: "Nueva venta", path: "/sales", icon: ShoppingBag },
    { label: "Nuevo pedido", path: "/orders", icon: ClipboardList },
    { label: "Productos", path: "/products", icon: Package },
    { label: "Clientes", path: "/customers", icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.path}
            onClick={() => router.push(action.path)}
            className="
              bg-[#472D20]
              hover:bg-[#5A2E1F]
              text-white
              rounded-xl
              p-5
              shadow-md
              border-2
              border-[#B8926B]
              flex
              items-center
              gap-3
              transition-all
              font-semibold
              group
            "
          >
            <div className="p-2 rounded-lg bg-[#FFF8E0]/10 group-hover:bg-[#FFF8E0]/20 transition-colors">
              <Icon size={22} className="text-[#FBEACE]" />
            </div>
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
