"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import ProductCard from "./productCard";

export default function NewSaleForm() {
  const router = useRouter();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Concha",
      description: "Pan dulce tradicional",
      price: 10,
      quantity: 0,
    },
    {
      id: 2,
      name: "Bolillo",
      description: "Pan para tortas",
      price: 5,
      quantity: 0,
    },
  ]);

  const increaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product,
      ),
    );
  };

  const decreaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: Math.max(1, product.quantity - 1),
            }
          : product,
      ),
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: quantity > 0 ? quantity : 1,
            }
          : product,
      ),
    );
  };

  return (
    <div>
      <h2
        className="
          text-2xl
          font-bold
          mb-4
          bg-[#472D20]
          text-white
          p-4
        "
      >
        Nueva Venta
      </h2>

      <SearchInput />

      <div className="space-y-4 mt-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            description={product.description}
            price={product.price}
            quantity={product.quantity}
            onIncrease={() => increaseQuantity(product.id)}
            onDecrease={() => decreaseQuantity(product.id)}
            onQuantityChange={(quantity) =>
              updateQuantity(product.id, quantity)
            }
          />
        ))}
      </div>

      <div className="mt-6">
        <Button className="w-full" onClick={() => router.push("/sales/cart")}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
