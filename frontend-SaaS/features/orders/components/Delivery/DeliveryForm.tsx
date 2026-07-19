"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface DeliveryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function DeliveryForm({
  initialData,
  onSubmit,
  loading = false,
}: DeliveryFormProps) {
  const [form, setForm] = useState({
    address: initialData?.address || "",
    reference: initialData?.reference || "",
    deliveryDate: initialData?.delivery_date || "",
    deliveryTime: initialData?.delivery_time || "",
    status: initialData?.status || "PENDING",
    notes: initialData?.notes || "",
  });

  const change = (field: string, value: string) => {
    setForm({
      ...form,

      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label>Dirección</label>

        <Input
          value={form.address}
          onChange={(e) => change("address", e.target.value)}
        />
      </div>

      <div>
        <label>Referencia</label>

        <Input
          value={form.reference}
          onChange={(e) => change("reference", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Fecha</label>

          <Input
            type="date"
            value={form.deliveryDate}
            onChange={(e) => change("deliveryDate", e.target.value)}
          />
        </div>

        <div>
          <label>Hora</label>

          <Input
            type="time"
            value={form.deliveryTime}
            onChange={(e) => change("deliveryTime", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label>Estado</label>

        <Select
          value={form.status}
          onChange={(e) => change("status", e.target.value)}
        >
          <option value="PENDING">Pendiente</option>

          <option value="ASSIGNED">Asignada</option>

          <option value="IN_ROUTE">En ruta</option>

          <option value="DELIVERED">Entregada</option>
        </Select>
      </div>

      <div>
        <label>Notas</label>

        <Input
          value={form.notes}
          onChange={(e) => change("notes", e.target.value)}
        />
      </div>

      <Button disabled={loading} onClick={() => onSubmit(form)}>
        {loading ? "Guardando..." : "Guardar entrega"}
      </Button>
    </div>
  );
}
