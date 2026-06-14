"use client";
import Button from "@/components/ui/Button";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SaleSuccess() {
  const router = useRouter();

  return (
    <div className="text-center">
      <CircleCheck className="mx-auto text-green-600" size={200} />

      <h1 className="text-green-600 text-5xl mt-4">Venta Completada</h1>

      <p className="mt-8 text-2xl">Venta realizada con éxito</p>

      <Button onClick={() => router.push("/sales/new-sales")} className="mt-6">
        Nueva Venta
      </Button>
    </div>
  );
}
