"use client";

import { useEffect, useState } from "react";

interface FormProps {
  initialData?: any;
  onChange: (data: any) => void;
}

export default function DeliveryForm({ initialData, onChange }: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "karla beatriz",
    phone: initialData?.phone || "2381235425",
    address: initialData?.address || "Privada 8 norte 1004",
    status: initialData?.status || "Pendiente",
    notes: initialData?.notes || "Casa grande con arbol enfrente",
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-[#472D20] tracking-wider">
            Nombre del destinatario *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#faefdf] border border-[#d3ba97] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] text-stone-800 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-[#472D20] tracking-wider">
            Teléfono de contacto *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[#faefdf] border border-[#d3ba97] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] text-stone-800 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-[#472D20] tracking-wider">
              Dirección exacta *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#faefdf] border border-[#d3ba97] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] text-stone-800 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-[#472D20] tracking-wider">
              Estado del envío
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-[#d3ba97] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] text-stone-800 transition-colors"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Ruta">En Ruta</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 h-full">
          <label className="text-[10px] font-bold uppercase text-[#472D20] tracking-wider">
            Notas del repartidor
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full h-full min-h-[90px] flex-1 resize-none bg-[#faefdf] border border-[#d3ba97] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] text-stone-800 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
