"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function Register() {
  const router = useRouter();

  const { register, loading } = useRegister();
  const [bakeryName, setBakeryName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bakeryEmail, setBakeryEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      const names = fullName.trim().split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      await register({
        bakery: {
          name: bakeryName,
          address,
          phone,
          email: bakeryEmail,
        },

        user: {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
      });

      router.push("/auth");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-row p-12 bg-[#472D20] h-screen">
      {/* Formulario */}
      <div className="border-[#EAD9B6] border-6 w-3/5 h-full rounded-lg flex items-center justify-center flex-col ml-20 px-24">
        <h1 className="text-6xl font-bold text-[#EAD9B6]">Registro</h1>

        <p className="text-2xl text-[#EAD9B6] mt-4">
          Registra tu panadería aquí
        </p>

        <div className="flex flex-row justify-around mt-10 w-full">
          {/* Panadería */}
          <div className="flex flex-col space-y-4 w-1/2">
            <p className="text-2xl text-[#EAD9B6] mb-4">
              Datos de la panadería:
            </p>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">Nombre:</label>

              <Input
                className="w-70"
                value={bakeryName}
                onChange={(e: any) => setBakeryName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Dirección:
              </label>

              <Input
                className="w-70"
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">Teléfono:</label>

              <Input
                className="w-70"
                value={phone}
                onChange={(e: any) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">Correo:</label>

              <Input
                className="w-70"
                value={bakeryEmail}
                onChange={(e: any) => setBakeryEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Usuario */}
          <div className="flex flex-col space-y-4 w-1/2">
            <p className="text-2xl text-[#EAD9B6] mb-4">
              Datos del propietario:
            </p>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Nombre completo:
              </label>

              <Input
                className="w-70"
                value={fullName}
                onChange={(e: any) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">Correo:</label>

              <Input
                className="w-70"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Contraseña:
              </label>

              <Input
                type="password"
                className="w-70"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <Button
              onClick={handleRegister}
              disabled={loading}
              variant="secondary"
              className="mt-6 h-14 w-80"
            >
              {loading ? "Registrando..." : "Registrar panadería"}
            </Button>
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="w-2/5 h-full rounded-lg flex items-center justify-center flex-col">
        <Image
          src="/images/login1.png"
          alt="Registro"
          width={2000}
          height={1200}
          className="w-full h-full object-contain rounded-lg ml-10"
        />
      </div>
    </main>
  );
}
