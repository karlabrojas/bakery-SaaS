"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Delivery } from "../../types/delivery.type";

interface DeliveryFormProps {
  initialData?: Delivery | null;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function DeliveryForm({
  initialData,
  onChange,
  onSubmit,
}: DeliveryFormProps) {
  // 1. Estado inicial adaptado completamente a camelCase con fallback seguro
  const [form, setForm] = useState({
    address: initialData?.address || "",
    recipientName:
      initialData?.recipientName ?? initialData?.recipient_name ?? "",
    recipientPhone:
      initialData?.recipientPhone ?? initialData?.recipient_phone ?? "",
    status: initialData?.status || "PENDING",
    notes: initialData?.notes || "",
  });

  // 2. useEffect para actualizar el formulario cuando los datos asíncronos del GET cambien
  useEffect(() => {
    if (!initialData) return;

    setForm({
      address: initialData.address ?? "",
      recipientName:
        initialData.recipientName ?? initialData.recipient_name ?? "",
      recipientPhone:
        initialData.recipientPhone ?? initialData.recipient_phone ?? "",
      status: initialData.status ?? "PENDING",
      notes: initialData.notes ?? "",
    });
  }, [initialData]);

  // 3. Función optimizada: Notifica el cambio al padre sin disparar el onSubmit continuo
  const change = (field: string, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    if (onChange) {
      onChange(updatedForm);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Nombre del Destinatario en camelCase */}
        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Nombre del Destinatario *
          </label>
          <Input
            required
            placeholder="Ej. Juan Pérez"
            value={form.recipientName}
            onChange={(e) => change("recipientName", e.target.value)}
          />
        </div>

        {/* Teléfono de Contacto en camelCase */}
        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Teléfono de Contacto *
          </label>
          <Input
            required
            placeholder="Ej. 2381234567"
            value={form.recipientPhone}
            onChange={(e) => change("recipientPhone", e.target.value)}
          />
        </div>
      </div>

      {/* Dirección Exacta */}
      <div>
        <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
          Dirección Exacta *
        </label>
        <Input
          required
          placeholder="Calle, Número, Colonia..."
          value={form.address}
          onChange={(e) => change("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Estado del Envío */}
        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Estado del Envío
          </label>
          <Select
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="PENDING">Pendiente</option>
            <option value="ASSIGNED">Asignada</option>
            <option value="IN_ROUTE">En ruta</option>
            <option value="DELIVERED">Entregada</option>
            <option value="CANCELLED">Cancelada</option>
          </Select>
        </div>

        {/* Notas del Repartidor */}
        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Notas del Repartidor
          </label>
          <Input
            placeholder="Indicaciones adicionales..."
            value={form.notes}
            onChange={(e) => change("notes", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
