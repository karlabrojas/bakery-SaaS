"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "../types/profile.type";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Props {
  user: UserProfile;
  onSave: (data: { first_name: string; last_name: string }) => Promise<void>;
}

export default function ProfileForm({ user, onSave }: Props) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }, [user]);

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
      alert("Perfil actualizado correctamente.");
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
        Información personal
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Nombre
        </label>
        <Input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Apellido
        </label>
        <Input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Correo
        </label>
        <Input
          value={user.email}
          disabled
          className="w-full opacity-60 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#472D20]">
          Rol
        </label>
        <Input
          value={user.role}
          disabled
          className="w-full opacity-60 cursor-not-allowed"
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
