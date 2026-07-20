"use client";
import { useState } from "react";
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
  const [form, setForm] = useState({
    address: initialData?.address || "",
    recipient_name: initialData?.recipient_name || "",
    recipient_phone: initialData?.recipient_phone || "",
    status: initialData?.status || "PENDING",
    notes: initialData?.notes || "",
  });

  const change = (field: string, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    if (onChange) {
      onChange(updatedForm);
    }
    if (onSubmit) {
      onSubmit(updatedForm);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Nombre del Destinatario *
          </label>
          <Input
            required
            placeholder="Ej. Juan Pérez"
            value={form.recipient_name}
            onChange={(e) => change("recipient_name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#472D20] uppercase tracking-wider mb-1">
            Teléfono de Contacto *
          </label>
          <Input
            required
            placeholder="Ej. 2381234567"
            value={form.recipient_phone}
            onChange={(e) => change("recipient_phone", e.target.value)}
          />
        </div>
      </div>

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
