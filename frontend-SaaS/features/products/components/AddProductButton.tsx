"use client";

import Button from "@/components/ui/Button";

interface AddProductButtonProps {
  onClick: () => void;
}

export default function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button onClick={onClick}>
      Agregar Producto
    </Button>
  );
}