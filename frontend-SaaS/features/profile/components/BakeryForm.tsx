"use client";

import { useEffect, useState } from "react";
import { BakeryProfile } from "../types/profile.type";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
      className="bg-white rounded-xl shadow-md p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-[#6B3118]">
        Información de la panadería
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Nombre
        </label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Dirección
        </label>
        <Input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Teléfono
        </label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Correo
        </label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={saving}
        variant="primary"
        className="w-full mt-2"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
