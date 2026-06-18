"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import PaymentModal from "@/features/sales/components/PaymentModal";
import { createSale } from "@/features/sales/services/api";

interface ItemCarrito {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = Number(searchParams.get("total")) || 0;

  const productos: ItemCarrito[] = useMemo(() => {
    const datos = searchParams.get("items");
    if (!datos) return [];
    try {
      return JSON.parse(decodeURIComponent(datos));
    } catch {
      return [];
    }
  }, [searchParams]);

  const confirmarPago = async (datosPago: {
    paymentMethod: "cash" | "card" | "transfer";
    received?: number;
    change?: number;
  }) => {
    setEnviando(true);
    setError(null);

    try {
      for (const producto of productos) {
        await createSale({
          product: producto.name,
          quantity: producto.quantity,
          total: producto.price * producto.quantity,
        });
      }

      console.log("Datos de pago:", datosPago);
      router.push("/sales/success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="mb-4 bg-[#472D20] p-4 text-2xl font-bold text-white">
          Pago
        </h1>

        <Card>
          <div className="space-y-2">
            <p className="text-lg">Total a pagar</p>
            <p className="text-4xl font-bold">${total}</p>
          </div>
        </Card>

        {error && <p className="mt-3 text-center text-red-500">{error}</p>}

        <div className="mt-6">
          <Button
            className="w-full"
            onClick={() => setModalAbierto(true)}
            disabled={enviando}
          >
            {enviando ? "Registrando venta..." : "Seleccionar Método de Pago"}
          </Button>
        </div>
      </div>

      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <PaymentModal total={total} onConfirm={confirmarPago} />
      </Modal>
    </>
  );
}