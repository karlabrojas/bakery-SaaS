"use client";

import { useState } from "react";
import { CartItem } from "../types/cart.type";
import { Product } from "../types/product.type";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    cart,
    addProduct,
    total,
  };
};
