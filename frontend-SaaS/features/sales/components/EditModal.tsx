"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import PaymentMethods from "./PaymentMethods";
import { updateSale } from "../services/api";
import { fetchProducts } from "@/features/products/services/products.service";

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
          price: product?.price ?? 0,
          imageUrl: product?.imageUrl ?? null,
        };
      }),
    );
  }, [sale, products]);

  if (!sale || !sale.id) return null;

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
    <Modal isOpen={open} onClose={onClose}>
      <div className="space-y-5">
        <div className="relative -mx-6 -mt-6 mb-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Editar venta</h2>

              <p className="text-sm text-[#FBEACE]">
                Actualiza el método de pago o las cantidades.
              </p>

              <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                Folio #{sale.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
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
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border bg-stone-100 shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        Sin foto
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900">{item.name}</h3>
                    <p className="text-sm text-stone-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  className="w-20 h-11 text-center font-bold text-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center rounded-2xl border border-stone-200 bg-[#FFFDF8] p-5">
          <p className="text-sm uppercase tracking-wide text-stone-500">
            Total de la venta
          </p>
          <p className="text-3xl font-black text-[#472D20]">
            ${sale.total_amount ?? 0}
          </p>
        </div>

        <div className="flex justify-end gap-4 border-t border-stone-200 pt-5">
          <Button variant="secondary" className="px-8 h-20" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            className="px-8 h-20"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
