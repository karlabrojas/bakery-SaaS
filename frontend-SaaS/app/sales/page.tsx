"use client";

import Button from "@/components/ui/Button";
import HistoryPage from "./history/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  return (
    <>
      <main className="p-6 ">
        <section className="flex flex-row ">
          <div>
            <h1 className="text-5xl font-bold mb-4"> Gestión de Ventas</h1>
            <p className="text-lg">
              En este apartado puedes gestionar todas las ventas de tu
              panadería.
            </p>
          </div>
          <div className="ml-auto">
            <Button
              className="ml-5"
              onClick={() => router.push("/sales/new-sales")}
            >
              + Agregar Venta
            </Button>
          </div>
        </section>
        <section className="mt-8">
          <HistoryPage />
        </section>
      </main>
    </>
  );
}
