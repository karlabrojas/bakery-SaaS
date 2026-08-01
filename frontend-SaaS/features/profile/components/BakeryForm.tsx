"use client";

import { useEffect, useState } from "react";
import { BakeryProfile } from "../types/profile.type";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Building2, MapPin, Phone, Mail } from "lucide-react";

interface Props {
  bakery: BakeryProfile;
  onSave: (data: {
    name: string;
    address: string;
    phone: string;
    email: string;
  }) => Promise<void>;
}

export default function BakeryForm({ bakery, onSave }: Props) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: bakery.name || "",
      address: bakery.address || "",
      phone: bakery.phone || "",
      email: bakery.email || "",
    });
  }, [bakery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await onSave(form);
      alert("Panadería actualizada correctamente.");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full justify-between space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#472D20] mb-4">
          Información de la panadería
        </h2>

        <div className="grid grid-cols-1 gap-4 bg-[#FAF6F0] rounded-xl p-5 border border-[#EFE9DD]">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#472D20]" /> Nombre
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#472D20]" /> Dirección
            </label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#472D20]" /> Teléfono
            </label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#472D20]" /> Correo
            </label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={saving}
          variant="primary"
          className="px-6 py-2.5 bg-[#472D20] text-white rounded-xl text-sm font-bold hover:bg-[#362117] disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm w-full md:w-auto"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
