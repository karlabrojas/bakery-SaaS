"use client";

import Button from "@/components/ui/Button";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SaleSuccess() {
  const router = useRouter();

  const folio =
    typeof window !== "undefined" ? localStorage.getItem("saleFolio") : null;

  return (
    <div className="text-center">
      <CircleCheck size={200} className="mx-auto text-green-600" />

      <h1 className="text-5xl text-green-600 mt-4">Venta Completada</h1>

      <p className="mt-6">Venta realizada con éxito</p>

      {folio && <p className="mt-4 font-bold">Folio: {folio}</p>}

      <Button className="mt-6" onClick={() => router.push("/sales/new-sales")}>
        Nueva Venta
      </Button>
    </div>
  );
}
