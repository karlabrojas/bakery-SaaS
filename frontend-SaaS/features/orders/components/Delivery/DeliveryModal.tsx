"use client";

import Modal from "@/components/ui/Modal";

import DeliveryForm from "./DeliveryForm";

interface Props {
  isOpen: boolean;

  onClose: () => void;

  onSubmit: (data: any) => void;

  delivery?: any;

  loading?: boolean;
}

export default function DeliveryModal({
  isOpen,

  onClose,

  onSubmit,

  delivery,

  loading,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <h2
          className="
text-2xl
font-bold
text-[#472D20]
"
        >
          {delivery ? "Editar entrega" : "Nueva entrega"}
        </h2>

        <DeliveryForm
          initialData={delivery}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
