"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { CircleCheck } from "lucide-react";

export default function SaleSuccess() {
  const router = useRouter();

  const folio =
    typeof window !== "undefined" ? localStorage.getItem("saleFolio") : null;

  return (
    <div className="flex flex-col items-center pt-10 pb-12 px-4 text-center max-w-md mx-auto">
      <div className="bg-green-50 p-6 rounded-full shadow-inner animate-pulse mb-4">
        <CircleCheck size={100} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-black text-green-700 tracking-tight">
        Venta Completada
      </h1>
      <p className="mt-2 text-sm text-stone-500 font-medium">
        La transacción se ha realizado con éxito.
      </p>

      {folio && (
        <div className="mt-5 bg-[#FAF3E8] border border-[#B8926B]/20 px-4 py-2 rounded-xl shadow-sm">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
            Folio de Venta
          </p>
          <p className="text-base font-mono font-black text-[#472D20] mt-0.5">
            {folio.toUpperCase()}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 w-full mt-8">
        <Button
          className="w-full h-11 text-sm font-bold shadow-md"
          onClick={() => router.push("/sales/new-sales")}
        >
          Nueva Venta
        </Button>

        <Button
          variant="secondary"
          className="w-full h-11 text-sm font-semibold border border-stone-200"
          onClick={() => router.push("/sales")}
        >
          Ir al Inicio
        </Button>
      </div>
    </div>
  );
}
