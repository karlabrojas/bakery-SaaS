"use client";

import { useEffect, useState } from "react";
import { fetchCustomers, createCustomer } from "../services/customers.service";
import { fetchProducts } from "@/features/products/services/products.service";
import { createOrder } from "../services/orders.service";
import DeliveryForm from "./Delivery/DeliveryForm";
import { useDeliveries } from "../hooks/useDeliveries";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);

  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">(
    "PICKUP",
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("0");

  const [items, setItems] = useState<
    { productId: string; quantity: number; name: string; price: number }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const { saveDelivery } = useDeliveries();

  const [deliveryData, setDeliveryData] = useState<any>(null);
  useEffect(() => {
    if (!isOpen) return;
    fetchCustomers().then(setCustomers).catch(console.error);
    fetchProducts().then(setProducts).catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  const agregarProducto = () => {
    if (products.length === 0) return;
    setItems((prev) => [
      ...prev,
      {
        productId: products[0].id,
        quantity: 1,
        name: products[0].name,
        price: products[0].price,
      },
    ]);
  };

  const actualizarItem = (
    index: number,
    productId: string,
    quantity: number,
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { productId, quantity, name: product.name, price: product.price }
          : item,
      ),
    );
  };

  const eliminarItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal - Number(discount);

  const handleGuardar = async () => {
    if (deliveryDate) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEntrega = new Date(deliveryDate + "T00:00:00");
      if (fechaEntrega < hoy) {
        setError("La fecha de entrega no puede ser una fecha pasada");
        return;
      }
    }
    if (!deliveryDate || !deliveryTime) {
      setError("La fecha y hora de entrega son obligatorias");
      return;
    }
    if (items.length === 0) {
      setError("Agrega al menos un producto");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let customerId = clienteSeleccionado || undefined;

      if (mostrarFormCliente && clienteNombre.trim()) {
        const nuevoCliente = await createCustomer({
          name: clienteNombre,
          phone: clienteTelefono,
        });
        customerId = nuevoCliente.id;
      }

      const order = await createOrder({
        customerId,
        deliveryType,
        deliveryDate,
        deliveryTime,
        discount: Number(discount),
        notes,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });

      if (deliveryType === "DELIVERY" && deliveryData) {
        await saveDelivery(order.id, deliveryData);
      }

      setExito(true);
      setTimeout(() => {
        setExito(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-10"
        >
          ✕
        </button>

        <div className="w-full space-y-6 p-6">
          <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Nuevo Pedido</h2>
            <p className="text-sm text-[#FBEACE] mt-1">
              Completa la información del pedido.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
              Cliente
            </label>

            <select
              value={clienteSeleccionado}
              onChange={(e) => {
                setClienteSeleccionado(e.target.value);
                setMostrarFormCliente(false);
              }}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
            >
              <option value="">Sin cliente o cliente general</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `— ${c.phone}` : ""}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setMostrarFormCliente(!mostrarFormCliente);
                setClienteSeleccionado("");
              }}
              className="text-sm text-[#472D20] font-semibold underline"
            >
              {mostrarFormCliente
                ? "Cancelar nuevo cliente"
                : "+ Agregar nuevo cliente"}
            </button>

            {mostrarFormCliente && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={clienteTelefono}
                    onChange={(e) => setClienteTelefono(e.target.value)}
                    placeholder="Teléfono"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Tipo *
              </label>
              <select
                value={deliveryType}
                onChange={(e) =>
                  setDeliveryType(e.target.value as "PICKUP" | "DELIVERY")
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
              >
                {deliveryType === "DELIVERY" && (
                  <div className="mt-5">
                    <h3 className="font-bold text-[#472D20] mb-3">
                      Información de entrega
                    </h3>

                    <DeliveryForm onSubmit={(data) => setDeliveryData(data)} />
                  </div>
                )}
                <option value="PICKUP">Recoger</option>
                <option value="DELIVERY">Envío</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Fecha *
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Hora *
              </label>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Productos *
              </label>
              <button
                onClick={agregarProducto}
                className="text-xs font-bold text-[#472D20] bg-[#FBEACE] px-3 py-1.5 rounded-lg hover:bg-[#f0d9a8] transition"
              >
                + Agregar producto
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-4">
                No hay productos agregados.
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 border border-stone-200 rounded-xl p-3"
                  >
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        actualizarItem(index, e.target.value, item.quantity)
                      }
                      className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#472D20] bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ${p.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        actualizarItem(
                          index,
                          item.productId,
                          Number(e.target.value),
                        )
                      }
                      className="w-20 border border-stone-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-[#472D20]"
                    />
                    <button
                      onClick={() => eliminarItem(index)}
                      className="text-red-500 hover:text-red-700 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                Notas
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones..."
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
              />
            </div>
          </div>

          <div className="bg-[#FBEACE] rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#472D20] text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-stone-200/80 pt-5">
            {exito && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl text-center font-medium mb-4">
                Pedido creado correctamente
              </div>
            )}
            {error && (
              <p className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium mb-4">
                {error}
              </p>
            )}
            <button
              onClick={handleGuardar}
              disabled={loading}
              className={`w-full h-14 text-lg font-bold bg-[#472D20] text-white rounded-xl transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#5c3a2a]"}`}
            >
              {loading ? "Guardando..." : "Crear Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
