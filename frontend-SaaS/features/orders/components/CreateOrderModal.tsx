"use client";

import React, { useState, useEffect } from "react";
import DeliveryForm from "./Delivery/DeliveryForm";
import { PaymentMethod } from "../types/payment.type";

// 👇 Importación de tus nuevos componentes de Pago
import AdvancePaymentForm from "./Payment/AdvancePaymentForm";
import PaymentSummaryCard from "./Payment/PaymentSummaryCard";

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
  onSuccess: () => void | Promise<void>;
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

  // Estados de control de la Orden (Delivery)
  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">(
    "PICKUP",
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryData, setDeliveryData] = useState<any>(null);

  // 💳 Estados de Pago sincronizados con AdvancePaymentForm
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentObservations, setPaymentObservations] = useState("");

  // Estados del Cliente Global
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);

  // Calcular el total de la orden basándose en los productos seleccionados
  const totalOrden = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Cargar catálogos y resetear estados
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
      // Reseteo de Payment
      setPaymentAmount(0);
      setPaymentMethod(PaymentMethod.CASH);
      setPaymentReference("");
      setPaymentObservations("");
    }
  }, [isOpen, fetchProducts, fetchCustomers]);

  // Si el usuario no ha puesto un anticipo manualmente, podemos sugerir el total
  // O dejarlo en 0 para que digite cuánto va a dejar de anticipo.
  useEffect(() => {
    if (totalOrden > 0 && paymentAmount === 0) {
      // Opcional: Descomenta la línea de abajo si quieres que por defecto el anticipo sea el total
      // setPaymentAmount(totalOrden);
    }
  }, [totalOrden]);

  if (!isOpen) return null;

  const agregarProducto = () => {
    if (!products || products.length === 0) return;
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
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item,
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

    try {
      setLoading(true);

      const payload = {
        deliveryType,
        deliveryDate,
        deliveryTime,
        customerId: selectedCustomerId || null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        total: totalOrden,
        // Envió de la estructura de pago con anticipos
        paymentData: {
          advance: paymentAmount,
          method: paymentMethod,
          reference: paymentReference,
          observations: paymentObservations,
          remaining: Math.max(totalOrden - paymentAmount, 0),
        },
        ...(deliveryType === "DELIVERY"
          ? {
              deliveryData: {
                ...deliveryData,
                estimatedDelivery:
                  deliveryDate && deliveryTime
                    ? new Date(`${deliveryDate}T${deliveryTime}`).toISOString()
                    : undefined,
              },
            }
          : {}),
      };

      console.log("Payload enviado a tu servicio:", payload);

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear la orden:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#472D20]">
            Crear Nueva Orden
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition p-1 rounded-lg hover:bg-stone-50"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* SECCIÓN DEL CLIENTE GLOBAL */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#472D20] text-sm uppercase tracking-wider">
                Información del Cliente
              </h3>
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
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                  Seleccionar Cliente
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
                >
                  <option value="">Cliente General (Público general)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3 p-3 bg-white border border-stone-200 rounded-xl">
                <p className="text-xs font-bold text-stone-500 uppercase">
                  Nuevo Cliente Rápido
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#472D20]"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono (Opcional)"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#472D20]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateCustomerFast}
                  className="w-full text-xs font-bold bg-[#472D20] text-white py-2 rounded-xl hover:bg-[#362117] transition"
                >
                  Guardar y Seleccionar Cliente
                </button>
              </div>
            )}
          </div>

          {/* Bloque de Tipo, Fecha y Hora */}
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
                required
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
                required
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
              />
            </div>
          </div>

          {/* Formulario de envío */}
          {deliveryType === "DELIVERY" && (
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <h3 className="font-bold text-[#472D20] mb-3 text-sm uppercase tracking-wider">
                Información de entrega
              </h3>
              <DeliveryForm onChange={(data) => setDeliveryData(data)} />
            </div>
          )}

          {/* Sección de productos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#472D20] text-sm uppercase tracking-wider">
                Productos
              </h3>
              <button
                type="button"
                onClick={agregarProducto}
                className="text-xs font-bold bg-[#472D20] text-white px-3 py-1.5 rounded-lg hover:bg-[#362117] transition"
              >
                + Agregar producto
              </button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100"
              >
                <select
                  value={item.productId}
                  onChange={(e) => actualizarProducto(index, e.target.value)}
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#472D20]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    actualizarCantidad(index, parseInt(e.target.value) || 1)
                  }
                  className="w-20 border border-stone-200 rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-[#472D20]"
                />

                <span className="text-sm font-semibold text-stone-700 w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => eliminarProducto(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* 💳 1. NUEVO FORMULARIO DE ANTICIPO */}
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

          {/* 📊 2. NUEVA TARJETA DE RESUMEN DE PAGO */}
          <PaymentSummaryCard total={totalOrden} advance={paymentAmount} />

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#472D20] text-white font-medium text-sm hover:bg-[#362117] transition disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
