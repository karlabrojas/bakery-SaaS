"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PaymentMethods from "./PaymentMethods";
import { updateSale } from "../services/api";
import { fetchAllProducts } from "@/features/products/services/products.service";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  sale: any;
  onUpdated: (sale: any) => void;
}

type Method = "Efectivo" | "Tarjeta" | "Transferencia";

const normalizeMethod = (method: string): Method => {
  switch (method?.toLowerCase()) {
    case "cash":
    case "efectivo":
      return "Efectivo";
    case "card":
    case "tarjeta":
      return "Tarjeta";
    case "transfer":
    case "transferencia":
      return "Transferencia";
    default:
      return "Efectivo";
  }
};

export default function EditSaleModal({
  open,
  onClose,
  sale,
  onUpdated,
}: Props) {
  const [method, setMethod] = useState<Method>("Efectivo");
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllProducts()
      .then((res) => {
        setProducts(res.filter((p: any) => p && p.id));
      })
      .catch(console.error);
  }, []);

  const productMap = new Map(
    products.filter((p) => p && p.id).map((p) => [p.id, p]),
  );

  useEffect(() => {
    if (!sale || products.length === 0) return;

    setMethod(normalizeMethod(sale.payment_method));

    setItems(
      (sale?.sale_items ?? []).map((i: any) => {
        const product = productMap.get(i.product_id);
        return {
          productId: i.product_id,
          name: product?.name ?? "Producto",
          quantity: String(i.quantity),
          price: product?.price ?? 0,
          imageUrl: product?.imageUrl ?? null,
        };
      }),
    );
  }, [sale, products]);

  if (!open || !sale || !sale.id) return null;

  const updateQuantity = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: value } : item,
      ),
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        paymentMethod: method,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
      };

      const res = await updateSale(sale.id, payload);
      const updatedSale = res.sale ?? res.data ?? res;

      onUpdated(updatedSale);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative bg-[#472D20] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-wide">Editar venta</h2>
            <p className="text-xs text-[#FBEACE] mt-0.5">
              Actualiza el método de pago o las cantidades.
            </p>
            <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold text-white">
              Folio #{sale.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#7C5A42] tracking-wider">
              Método de pago
            </label>
            <PaymentMethods selectedMethod={method} onSelect={setMethod} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-[#7C5A42] tracking-wider">
              Ajustar cantidades
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-[#D9C3A9] bg-white p-3 shadow-xs gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#D9C3A9] bg-[#FAF4ED] shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] text-[#8C6D53]">
                          Sin foto
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#472D20] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-mono text-[#7C5A42]">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#7C5A42] hidden sm:inline">
                      Cant:
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                      className="w-16 h-10 text-center font-bold text-sm bg-white border-[#D9C3A9] text-[#472D20] rounded-xl focus:border-[#472D20]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center rounded-xl border border-[#D9C3A9] bg-[#FAF4ED] p-4">
            <p className="text-xs uppercase tracking-wider font-bold text-[#7C5A42]">
              Total de la venta
            </p>
            <p className="text-2xl font-black font-mono text-[#472D20]">
              $
              {Number(sale.total_amount ?? 0).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#D9C3A9] bg-white px-6 py-4">
          <Button
            variant="secondary"
            className="px-5 h-11 text-xs bg-white border border-[#D9C3A9] text-[#472D20] hover:bg-[#FAF4ED] rounded-xl"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            className="px-6 h-11 text-xs font-bold bg-[#472D20] hover:bg-[#3B281A] text-white rounded-xl shadow-xs"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
