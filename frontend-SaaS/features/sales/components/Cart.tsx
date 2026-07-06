"use client";

import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { CartItem } from "../types/cart.type";

interface Props {
  items: CartItem[];
  total: number;
  loading: boolean;

  onCheckout: () => void;
  onContinueShopping: () => void;
  onClearCart: () => void;
  onRemoveItem: (id: string) => void;
}

export default function Cart({
  items,
  total,
  loading,
  onCheckout,
  onContinueShopping,
  onClearCart,
  onRemoveItem,
}: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#FFFCF5] rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
      <div className="bg-[#472D20] px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Resumen de Venta</h2>

        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {items.reduce((acc, item) => acc + item.quantity, 0)} productos
        </span>
      </div>

      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-14 text-center">
            <ShoppingCart size={52} className="mx-auto text-stone-300 mb-3" />

            <p className="text-stone-400 font-medium">
              No hay productos en el carrito.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-stone-200 rounded-2xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden border bg-stone-100 shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                      Sin foto
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-stone-500">{item.description}</p>

                  <p className="mt-2 text-lg font-bold text-[#472D20]">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Eliminar producto"
                >
                  <Trash2 size={22} />
                </button>

                <p className="text-2xl font-bold text-[#472D20]">
                  x{item.quantity}
                </p>

                <p className="text-xl font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-stone-200 px-6 py-4 flex flex-wrap justify-between gap-3">
        <Button
          variant="secondary"
          onClick={onContinueShopping}
          className="flex items-center gap-2 px-5 py-3"
        >
          <ArrowLeft size={18} />
          Continuar comprando
        </Button>

        <Button
          variant="danger"
          disabled={items.length === 0}
          onClick={onClearCart}
          className="flex items-center gap-2 px-5 py-3"
        >
          <Trash2 size={18} />
          Vaciar carrito
        </Button>
      </div>

      {/* Footer */}
      <div className="border-t border-stone-100 p-6 flex justify-between items-center">
        <div>
          <p className="text-sm uppercase text-stone-500">Total</p>

          <p className="text-3xl font-black text-[#472D20]">
            ${total.toFixed(2)}
          </p>
        </div>

        <Button
          className="w-60 h-22"
          disabled={items.length === 0 || loading}
          onClick={onCheckout}
        >
          {loading ? "Procesando..." : "Proceder al pago"}
        </Button>
      </div>
    </div>
  );
}
