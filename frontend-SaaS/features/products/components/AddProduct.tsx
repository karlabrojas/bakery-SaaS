"use client";

import { useState } from "react";
import AddProductButton from "./AddProductButton";
import AddProductModal from "./AddProductModal";

export default function AddProduct() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      <AddProductButton onClick={() => setModalAbierto(true)} />

      <AddProductModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </>
  );
}