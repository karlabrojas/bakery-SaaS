"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import PaymentModal from "@/features/sales/components/PaymentModal";

import { useCartStore } from "@/features/sales/store/useCartStore";

import { createSale } from "@/features/sales/services/api";

import { generateFolio } from "@/features/sales/utils/generateFolio";

import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const total = useCartStore((state) => state.total());

  const clearCart = useCartStore((state) => state.clearCart);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const confirmPayment = async (paymentData: {
    paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";
  }) => {
    try {
      setLoading(true);

      await createSale({
        paymentMethod: paymentData.paymentMethod,

        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      localStorage.setItem("saleFolio", generateFolio());

      clearCart();

      router.push("/sales/success");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Resumen de venta</h1>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border p-3 rounded-lg mb-2"
          >
            <span>
              {item.name} x {item.quantity}
            </span>

            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="mt-4 text-xl font-bold">Total: ${total.toFixed(2)}</div>

        <Button
          className="w-full mt-6"
          disabled={loading}
          onClick={() => setModalOpen(true)}
        >
          Confirmar Venta
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PaymentModal total={total} onConfirm={confirmPayment} />
      </Modal>
    </>
  );
}
