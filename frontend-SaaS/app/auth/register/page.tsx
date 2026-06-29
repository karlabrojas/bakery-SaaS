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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const names = fullName.trim().split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      await register({
        bakery: {
          name: bakeryName,
          address: "",
          phone: "",
          email: "",
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
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-16">
        {/* Formulario */}
        <div className="w-full max-w-2xl rounded-2xl bg-[#472D20] border-4 border-[#EAD9B6] shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-center text-[#EAD9B6]">
            Crear cuenta
          </h1>

          <p className="text-center text-[#EAD9B6]/80 mt-2 mb-10">
            Registra tu panadería para comenzar.
          </p>

          <div className="space-y-6">
            {/* Nombre panadería */}
            <div>
              <label className="block text-[#EAD9B6] font-semibold mb-2">
                Nombre de la panadería
              </label>

              <Input
                value={bakeryName}
                onChange={(e: any) => setBakeryName(e.target.value)}
                className="w-full h-12 bg-[#FAF3E8] text-[#472D20]"
              />
            </div>

            {/* Fila 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#EAD9B6] font-semibold mb-2">
                  Nombre completo
                </label>

                <Input
                  value={fullName}
                  onChange={(e: any) => setFullName(e.target.value)}
                  className="h-12 bg-[#FAF3E8] text-[#472D20] w-full"
                />
              </div>

              <div>
                <label className="block text-[#EAD9B6] font-semibold mb-2">
                  Correo electrónico
                </label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  className="h-12 bg-[#FAF3E8] text-[#472D20] w-full"
                />
              </div>
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#EAD9B6] font-semibold mb-2">
                  Contraseña
                </label>

                <Input
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  className="h-12 bg-[#FAF3E8] text-[#472D20] w-full"
                />
              </div>

              <div>
                <label className="block text-[#EAD9B6] font-semibold mb-2">
                  Confirmar contraseña
                </label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-[#FAF3E8] text-[#472D20] w-full"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            <Button
              onClick={handleRegister}
              disabled={loading}
              variant="secondary"
              className="w-full h-16 text-base font-bold"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>

            <Button
              variant="link"
              onClick={() => router.push("/auth")}
              className="w-full text-center text-[#EAD9B6]"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </div>
        </div>

        {/* Imagen */}
        <div className="hidden lg:flex flex-1 relative h-[650px]">
          <Image
            src="/images/login1.png"
            alt="Registro"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </main>
  );
}
