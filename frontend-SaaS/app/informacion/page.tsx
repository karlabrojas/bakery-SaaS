"use client";

import Image from "next/image";
import { useState } from "react";

export default function InformacionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    problem: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Formulario enviado correctamente");

      setFormData({
        name: "",
        email: "",
        problem: "",
      });
    } catch (error) {
      console.error(error);

      alert("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#904939] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#66260B] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* IZQUIERDA */}
        <div className="relative w-full md:w-1/2 p-8 md:p-12">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/panes.png"
              alt="Panes"
              fill
              className="object-cover opacity-30"
            />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-serif font-bold text-white mb-8">
              Beneficios
            </h1>

            <ul className="text-white text-lg space-y-4 font-medium">
              <li>• Reduce desperdicios y pérdidas.</li>
              <li>• Mejora la organización del negocio.</li>
              <li>• Evita faltantes de ingredientes.</li>
              <li>• Optimiza compras y producción.</li>
              <li>• Centraliza pedidos, ventas e inventario.</li>
              <li>• Ahorra tiempo administrativo.</li>
            </ul>
          </div>
        </div>

        {/* DERECHA */}
        <div className="w-full md:w-1/2 bg-[#C1583B] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Registro
          </h2>

          <p className="text-white text-sm mb-8 leading-tight">
            ¡Optimiza tu panadería! Regístrate para que nos pongamos en contacto
            contigo
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* NOMBRE */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">
                Nombre:
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">
                Correo electrónico:
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium"
              />
            </div>

            {/* PROBLEM */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">
                ¿Qué problema quieres resolver?
              </label>

              <input
                type="text"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                required
                className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#66260B] text-white font-bold py-3 rounded-full shadow-lg transition-transform hover:scale-[1.02]"
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
