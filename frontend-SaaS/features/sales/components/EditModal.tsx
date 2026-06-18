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
      return "Efectivo";
    case "card":
      return "Tarjeta";
    case "transfer":
      return "Transferencia";
    case "tarjeta":
      return "Tarjeta";
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
    if (!sale) return;
    if (products.length === 0) return;

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#FBEACE] w-[520px] p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Editar Venta</h2>

        <p className="text-sm text-gray-600">
          Folio:{" "}
          {sale?.id ? sale.id.substring(0, 8).toUpperCase() : "SIN FOLIO"}
        </p>

        <PaymentMethods selectedMethod={method} onSelect={setMethod} />

        <div className="space-y-3">
          <h3 className="font-semibold">Productos</h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 border p-2 rounded "
            >
              <span className="text-sm font-medium">{item.name}</span>

              <Input
                type="text"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, e.target.value)}
                className="w-20 text-center"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total actual</span>
          <span>${sale?.total_amount ?? 0}</span>
        </div>

        <div className="flex gap-2">
          <Button className="w-full" onClick={handleUpdate} disabled={loading}>
            {loading ? "Actualizando..." : "Guardar cambios"}
          </Button>

          <Button variant="secondary" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
