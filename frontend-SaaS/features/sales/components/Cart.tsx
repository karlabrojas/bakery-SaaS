"use client";

import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartProps {
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
}: CartProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#D9C3A9] overflow-hidden">
      <div className="bg-[#4A3525] px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart size={22} className="text-[#EAD9B6]" />
          <h1 className="text-lg font-bold tracking-wide">
            Carrito de Compras
          </h1>
        </div>
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-[#F8F1E4]"
        >
          <ArrowLeft size={14} />
          <span>Seguir comprando</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {items.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-[#FAF4ED] border border-dashed border-[#D9C3A9]">
            <ShoppingCart
              size={40}
              className="mx-auto text-[#8C6D53] mb-3 opacity-50"
            />
            <p className="text-sm font-medium text-[#7C5A42]">
              Tu carrito está vacío.
            </p>
            <button
              onClick={onContinueShopping}
              className="mt-4 px-4 py-2 text-xs font-bold bg-[#4A3525] text-white rounded-xl hover:bg-[#3B281A] transition-colors shadow-sm"
            >
              Agregar productos
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#EFE7DE] max-h-96 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#FAF4ED] border border-[#D9C3A9] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingCart size={20} className="text-[#8C6D53]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#4A3525]">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#7C5A42] font-mono mt-0.5">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-[#3B281A] font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <span className="px-3 py-1 rounded-lg bg-[#FAF4ED] border border-[#D9C3A9] text-xs font-semibold text-[#4A3525]">
                      Cant: {item.quantity}
                    </span>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D9C3A9] pt-6 space-y-4">
              <div className="bg-[#FFFCF5] border border-[#D9C3A9] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7C5A42]">
                    Total a Pagar
                  </p>
                  <p className="text-xs text-[#8C6D53] mt-0.5">
                    Impuestos incluidos
                  </p>
                </div>
                <div className="text-2xl font-extrabold text-[#3B281A] font-mono">
                  ${total.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onClearCart}
                  className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
                >
                  Vaciar carrito
                </button>

                <button
                  onClick={onCheckout}
                  disabled={loading}
                  className="px-6 py-3 bg-[#4A3525] hover:bg-[#3B281A] text-white text-xs font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Proceder al Pago"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
