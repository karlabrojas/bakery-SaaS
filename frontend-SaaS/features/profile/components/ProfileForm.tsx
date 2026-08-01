"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "../types/profile.type";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User, Mail, Shield } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#472D20] mb-4">
          Información personal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6F0] rounded-xl p-5 border border-[#EFE9DD]">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#472D20]" /> Nombre
            </label>
            <Input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#472D20]" /> Apellido
            </label>
            <Input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#472D20] transition bg-white font-medium text-stone-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#472D20]" /> Correo
            </label>
            <Input
              value={user.email}
              disabled
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-stone-100 font-medium text-stone-500 shadow-sm opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#472D20]" /> Rol
            </label>
            <Input
              value={user.role}
              disabled
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-stone-100 font-medium text-stone-500 shadow-sm opacity-60 cursor-not-allowed"
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
