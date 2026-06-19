"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PaymentMethods from "./PaymentMethods";
import { updateSale, fetchProducts } from "../services/api";

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
    fetchProducts()
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FBEACE] w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-[#B8926B]/30 space-y-5">
        <div className="flex justify-between items-start border-b border-[#B8926B]/20 pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#472D20]">
              Editar Registro de Venta
            </h2>
            <p className="text-xs font-mono font-bold bg-[#472D20]/10 text-[#472D20] px-2 py-0.5 rounded mt-1 inline-block">
              Folio: {sale.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-stone-600 tracking-wider">
            Método de pago
          </label>
          <PaymentMethods selectedMethod={method} onSelect={setMethod} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
            Ajustar cantidades
          </h3>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 bg-white/60 border border-stone-200 p-3 rounded-lg shadow-sm"
              >
                <span className="text-sm font-semibold text-stone-800">
                  {item.name}
                </span>
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  className="w-20 text-center font-mono h-9 bg-white border-stone-300 focus:border-[#472D20]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center font-bold border-t border-[#B8926B]/20 pt-3 bg-white/40 p-3 rounded-lg">
          <span className="text-stone-600 font-medium text-sm">
            Monto Total Original:
          </span>
          <span className="text-lg font-black text-[#472D20] font-mono">
            ${sale?.total_amount ?? 0}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            className="w-full h-11 text-sm font-medium"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="w-full h-11 text-sm font-semibold shadow-md"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
