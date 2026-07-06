"use client";

import { useState } from "react";
import AddProductButton from "./AddProductButton";
import AddProductModal from "./AddProductModal";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function AddProduct() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const {loadProducts } = useProducts();

  return (
    <>
      <AddProductButton onClick={() => setModalAbierto(true)} />

      <AddProductModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSuccess={loadProducts}
      />
    </>
  );
}