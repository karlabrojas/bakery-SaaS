"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import PaymentModal from "@/features/sales/components/PaymentModal";

import { createSale } from "@/features/sales/services/api";

import { useCartStore } from "@/features/sales/store/useCartStore";

import { generateFolio } from "@/features/sales/utils/generateFolio";

export default function PaymentPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const total = useCartStore((state) => state.total());

  const clearCart = useCartStore((state) => state.clearCart);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const confirmPayment = async (paymentData: {
    paymentMethod: "cash" | "card" | "transfer";
  }) => {
    try {
      setLoading(true);

      await createSale({
        bakeryId: "UUID_DE_TU_PANADERIA",

        paymentMethod: paymentData.paymentMethod,

        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      localStorage.setItem("saleFolio", generateFolio());

      clearCart();

      router.push("/sales/success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <p>Total:</p>

        <p className="text-4xl font-bold">${total}</p>
      </Card>

      {error && <p className="text-red-500">{error}</p>}

      <Button
        className="w-full mt-4"
        onClick={() => setModalOpen(true)}
        disabled={loading}
      >
        Seleccionar Método
      </Button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PaymentModal total={total} onConfirm={confirmPayment} />
      </Modal>
    </>
  );
}
