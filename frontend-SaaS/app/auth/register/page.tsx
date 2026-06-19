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
    <main className="min-h-screen w-full flex items-center justify-center bg-[#472D20] p-6 md:p-12">
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full max-w-6xl gap-8 lg:gap-12">
        {/* Formulario */}
        <div className="lg:flex-[1.3] flex justify-center items-center">
          <div className="border-[#EAD9B6] border-4 w-full rounded-xl p-8 sm:p-12 flex flex-col items-center shadow-xl bg-[#472D20]">
            <h1 className="text-5xl font-bold text-[#EAD9B6] tracking-tight">
              Registro
            </h1>
            <p className="text-xl text-[#EAD9B6] mt-2 mb-8 font-light">
              Registra tu panadería aquí
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
              {/* Panadería */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-[#EAD9B6] border-b border-[#EAD9B6]/20 pb-2">
                  Datos de la panadería:
                </h2>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Nombre:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={bakeryName}
                    onChange={(e: any) => setBakeryName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Dirección:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={address}
                    onChange={(e: any) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Teléfono:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Correo:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={bakeryEmail}
                    onChange={(e: any) => setBakeryEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Usuario */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-[#EAD9B6] border-b border-[#EAD9B6]/20 pb-2">
                  Datos del propietario:
                </h2>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Nombre completo:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={fullName}
                    onChange={(e: any) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Correo:
                  </label>
                  <Input
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-base text-[#EAD9B6]">
                    Contraseña:
                  </label>
                  <Input
                    type="password"
                    className="w-full bg-[#FAF3E8] border-none text-[#472D20]"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="pt-4 flex flex-col space-y-3">
                  <Button
                    onClick={handleRegister}
                    disabled={loading}
                    variant="secondary"
                    className="w-full h-12 text-base font-bold bg-[#EAD9B6] text-[#472D20] hover:bg-[#f3e4c5] transition-colors rounded-md shadow"
                  >
                    {loading ? "Registrando..." : "Registrar panadería"}
                  </Button>

                  <Button
                    onClick={() => router.push("/auth")}
                    variant="link"
                    className="text-[#EAD9B6] text-center text-sm font-semibold hover:text-white underline underline-offset-4 p-0 self-center"
                  >
                    ¿Ya tienes cuenta? Volver al Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="hidden lg:block lg:flex-[0.7] relative min-h-[550px]">
          <Image
            src="/images/login1.png"
            alt="Registro"
            fill
            priority
            className="object-contain object-center"
          />
        </div>
      </div>
    </main>
  );
}
