"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import PaymentModal from "@/features/sales/components/PaymentModal";

export default function PaymentPage() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const total = 250;

  const handlePayment = (paymentData: {
    paymentMethod: "cash" | "card" | "transfer";

    received?: number;

    change?: number;
  }) => {
    console.log(paymentData);

    router.push("/sales/success");
  };

  return (
    <>
      <div>
        <h1
          className="
            mb-4
            bg-[#472D20]
            p-4
            text-2xl
            font-bold
            text-white
          "
        >
          Pago
        </h1>

        <Card>
          <div className="space-y-2">
            <p className="text-lg">Total a pagar</p>

            <p className="text-4xl font-bold">${total}</p>
          </div>
        </Card>

        <div className="mt-6">
          <Button className="w-full" onClick={() => setIsOpen(true)}>
            Seleccionar Método de Pago
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PaymentModal total={total} onConfirm={handlePayment} />
      </Modal>
    </>
  );
}
