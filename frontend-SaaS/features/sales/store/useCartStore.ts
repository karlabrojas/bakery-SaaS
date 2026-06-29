"use client";

import { create } from "zustand";
import { CartItem } from "../types/cart.type";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: item.quantity,
                }
              : i,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  clearCart: () =>
    set({
      items: [],
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  total: () =>
    get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
