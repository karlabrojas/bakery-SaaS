"use client";

import React, { useState, useEffect } from "react";
import DeliveryForm from "./Delivery/DeliveryForm";
import { PaymentMethod } from "../types/payment.type";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import AdvancePaymentForm from "./Payment/AdvancePaymentForm";
import { Store, Truck } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payload: any) => void | Promise<void>;
  fetchProducts: () => Promise<Product[]>;
  fetchCustomers: () => Promise<Customer[]>;
  onCreateCustomer?: (name: string, phone: string) => Promise<Customer>;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSuccess,
  fetchProducts,
  fetchCustomers,
  onCreateCustomer,
}: CreateOrderModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">(
    "PICKUP",
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryData, setDeliveryData] = useState<any>(null);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentObservations, setPaymentObservations] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const totalOrden = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 0),
    0,
  );
  const restanteOrden = Math.max(0, totalOrden - paymentAmount);

  useEffect(() => {
    if (isOpen) {
      fetchProducts().then((data) => setProducts(data));
      fetchCustomers().then((data) => setCustomers(data));
    } else {
      setItems([]);
      setDeliveryType("PICKUP");
      setDeliveryDate("");
      setDeliveryTime("");
      setDeliveryData(null);
      setSelectedCustomerId("");
      setIsCreatingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setPaymentAmount(0);
      setPaymentMethod(PaymentMethod.CASH);
      setPaymentReference("");
      setPaymentObservations("");
    }
  }, [isOpen, fetchProducts, fetchCustomers]);

  if (!isOpen) return null;

  const agregarProducto = () => {
    if (!products || products.length === 0) return;

    setItems((prev) => [
      ...prev,
      {
        productId: products[0].id,
        quantity: 0,
        name: products[0].name,
        price: products[0].price,
      },
    ]);
  };

  const actualizarProducto = (index: number, productId: string) => {
    const prodEncontrado = products.find((p) => p.id === productId);
    if (!prodEncontrado) return;

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId: prodEncontrado.id,
              name: prodEncontrado.name,
              price: prodEncontrado.price,
            }
          : item,
      ),
    );
  };

  const actualizarCantidad = (index: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: isNaN(quantity) ? 0 : quantity,
            }
          : item,
      ),
    );
  };

  const eliminarProducto = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCustomerFast = async () => {
    if (!newCustomerName.trim()) {
      alert("El nombre del cliente es obligatorio.");
      return;
    }
    if (!onCreateCustomer) {
      alert("La función para crear clientes no está implementada.");
      return;
    }

    try {
      setLoading(true);
      const newCustomer = await onCreateCustomer(
        newCustomerName,
        newCustomerPhone,
      );
      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomerId(newCustomer.id);
      setIsCreatingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
    } catch (error) {
      console.error("Error al crear cliente:", error);
      alert("No se pudo crear el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Debes agregar al menos un producto.");
      return;
    }
    if (deliveryType === "DELIVERY" && !deliveryData) {
      alert("Por favor completa la información de entrega.");
      return;
    }
    if (paymentAmount > totalOrden) {
      alert("El monto del anticipo no puede ser mayor al total de la orden.");
      return;
    }

    if (items.some((item) => !item.quantity || item.quantity <= 0)) {
      alert("Todos los productos añadidos deben tener una cantidad mayor a 0.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerId: selectedCustomerId || undefined,
        deliveryType,
        deliveryDate,
        deliveryTime,
        notes: paymentObservations || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        initialAdvance:
          paymentAmount > 0
            ? {
                amount: Number(paymentAmount),
                paymentMethod: paymentMethod,
                reference: paymentReference || undefined,
              }
            : undefined,
        deliveryData: deliveryType === "DELIVERY" ? deliveryData : undefined,
      };

      await onSuccess(payload);
    } catch (error) {
      console.error("Error al procesar el envío en el modal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-[#FFFDF9] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="relative bg-[#472D20] px-6 py-5 rounded-t-2xl flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Crear Nueva Orden</h2>
            <p className="text-sm text-[#FBEACE] mt-1">
              Completa la información para registrar el pedido en el sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl font-bold p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          <div className="space-y-6 p-6 flex-1">
            <div className="space-y-2 bg-[#FAF6F0] p-4 border border-[#EFE9DD] rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  Información del Cliente
                </label>
                {onCreateCustomer && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCustomer(!isCreatingCustomer)}
                    className="text-xs font-bold text-[#472D20] hover:underline"
                  >
                    {isCreatingCustomer
                      ? "← Seleccionar existente"
                      : "+ Nuevo cliente"}
                  </button>
                )}
              </div>

              {!isCreatingCustomer ? (
                <Select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl"
                >
                  <option value="">Cliente General (Público general)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ""}
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="space-y-3 p-3.5 bg-white border border-[#E6DEC9] rounded-xl shadow-sm">
                  <p className="text-xs font-bold text-[#472D20] uppercase tracking-wider">
                    Nuevo Cliente Rápido
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="Nombre completo *"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="tel"
                      placeholder="Teléfono (Opcional)"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateCustomerFast}
                    className="w-full h-10 text-sm font-bold bg-[#472D20] text-white rounded-xl hover:bg-[#362117] transition shadow-sm"
                  >
                    Guardar y Seleccionar
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#FAF6F0] p-4 border border-[#EFE9DD] rounded-xl space-y-4">
              <p className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Logística de Entrega
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-600">
                    Tipo de entrega *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C6D53]">
                      {deliveryType === "PICKUP" ? (
                        <Store size={16} />
                      ) : (
                        <Truck size={16} />
                      )}
                    </div>
                    <Select
                      value={deliveryType}
                      onChange={(e) =>
                        setDeliveryType(e.target.value as "PICKUP" | "DELIVERY")
                      }
                      className="w-full bg-white pl-10"
                    >
                      <option value="PICKUP">Recoger en tienda</option>
                      <option value="DELIVERY">Envío a domicilio</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-600">
                    Fecha prometida *
                  </label>
                  <Input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-600">
                    Hora prometida *
                  </label>
                  <Input
                    type="time"
                    required
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full bg-white"
                  />
                </div>
              </div>

              {deliveryType === "DELIVERY" && (
                <div className="border border-[#EFE9DD] rounded-xl p-4 bg-white shadow-sm space-y-2">
                  <h3 className="font-bold text-[#472D20] text-xs uppercase tracking-wider">
                    Dirección de Destino
                  </h3>
                  <DeliveryForm onChange={setDeliveryData} />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                  Productos del Pedido
                </label>
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="h-9 px-4 text-xs font-bold bg-white text-[#472D20] border border-[#EFE9DD] rounded-xl hover:bg-[#FAF6F0] transition shadow-sm"
                >
                  ＋ Agregar Producto
                </button>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6 bg-stone-50 rounded-xl border border-dashed">
                  No hay productos añadidos a esta orden.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-[#EFE9DD] shadow-sm"
                    >
                      <div className="flex-1">
                        <Select
                          value={item.productId}
                          onChange={(e) =>
                            actualizarProducto(index, e.target.value)
                          }
                          className="w-full"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (${p.price.toFixed(2)})
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="w-24">
                          <Input
                            type="number"
                            min="0"
                            value={item.quantity === 0 ? "" : item.quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              actualizarCantidad(
                                index,
                                val === "" ? 0 : Number(val),
                              );
                            }}
                            className="w-full text-center font-bold"
                          />
                        </div>

                        <span className="text-sm font-bold text-[#472D20] w-24 text-right whitespace-nowrap">
                          ${(item.price * (item.quantity || 0)).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => eliminarProducto(index)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition flex items-center justify-center border border-transparent hover:border-red-100"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#EFE9DD] rounded-xl p-4 bg-[#FAF6F0]">
              <p className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-3">
                Gestión de Anticipos Financieros
              </p>
              <AdvancePaymentForm
                amount={paymentAmount}
                setAmount={setPaymentAmount}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                reference={paymentReference}
                setReference={setPaymentReference}
                observations={paymentObservations}
                setObservations={setPaymentObservations}
              />
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#EFE9DD] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
              <div className="flex flex-col space-y-1 sm:border-r border-stone-100 pr-2">
                <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                  Costo Total
                </span>
                <span className="text-xl font-bold text-stone-800">
                  ${totalOrden.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col space-y-1 sm:border-r border-stone-100 pr-2">
                <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                  Anticipo Dejado
                </span>
                <div>
                  {paymentAmount > 0 ? (
                    <span className="inline-block text-base font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                      -${paymentAmount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400 italic">
                      Sin anticipo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                  Saldo Restante
                </span>
                <div>
                  {restanteOrden === 0 && totalOrden > 0 ? (
                    <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
                      ¡Liquidado! ✨
                    </span>
                  ) : (
                    <span className="text-2xl font-black text-[#472D20]">
                      ${restanteOrden.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 bg-stone-50/50 p-4 flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#472D20] text-white rounded-xl text-sm font-bold hover:bg-[#362117] disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? "Creando..." : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
