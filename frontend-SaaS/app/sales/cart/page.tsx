"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Cart from "@/features/sales/components/Cart";
import PaymentModal from "@/features/sales/components/PaymentModal";
import ConfirmDeleteModal from "@/features/sales/components/ConfirmDeleteModal";
import { useCartStore } from "@/features/sales/store/useCartStore";
import { createSale } from "@/features/sales/services/api";
import { generateFolio } from "@/features/sales/utils/generateFolio";

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());

  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("Eliminar");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

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
      setPaymentModalOpen(false);
      router.push("/sales/success");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setConfirmTitle("Eliminar producto");
    setConfirmMessage(
      "¿Está seguro de que desea eliminar este producto del carrito?",
    );
    setConfirmButtonText("Eliminar");
    setConfirmAction(() => () => {
      removeItem(id);
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleClearCart = () => {
    setConfirmTitle("Vaciar carrito");
    setConfirmMessage(
      "¿Está seguro de que desea eliminar todos los productos del carrito?",
    );
    setConfirmButtonText("Vaciar carrito");
    setConfirmAction(() => () => {
      clearCart();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleContinueShopping = () => {
    router.push("/sales");
  };

  return (
    <>
      <Cart
        items={items}
        total={total}
        loading={loading}
        onCheckout={() => setPaymentModalOpen(true)}
        onContinueShopping={handleContinueShopping}
        onClearCart={handleClearCart}
        onRemoveItem={handleRemoveItem}
      />

      <Modal
        isOpen={paymentModalOpen}
        onClose={() => !loading && setPaymentModalOpen(false)}
      >
        <PaymentModal total={total} onConfirm={confirmPayment} />
      </Modal>

      <ConfirmDeleteModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmButtonText}
        loading={false}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />
    </>
  );
}
