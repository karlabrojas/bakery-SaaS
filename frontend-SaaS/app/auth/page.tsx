"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function Login() {
  const router = useRouter();

  const { login, loading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);

      router.push("/sales");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-row p-24">
      {/* Izquierda */}
      <div className="border-[#472D20] border-6 w-2/4 h-130 rounded-lg flex items-center justify-center flex-col ml-20">
        <h1 className="text-8xl font-bold">Login</h1>

        <label className="m-4 mt-6 text-2xl">Correo electrónico:</label>

        <Input
          className="w-3/4"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
        />

        <label className="m-4 text-2xl">Contraseña:</label>

        <Input
          className="w-3/4"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          placeholder="********"
        />

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <Button onClick={handleLogin} disabled={loading} className="mt-4 h-14">
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </Button>

        <div className="flex flex-row items-center justify-center mt-6">
          <p>¿Aún no tienes una cuenta?</p>

          <Button
            onClick={() => router.push("/auth/register")}
            variant="link"
            className="hover:text-[#EAD9B6]"
          >
            Regístrate aquí
          </Button>
        </div>
      </div>

      {/* Imagen */}
      <div className="w-2/3 h-120 rounded-lg flex items-center justify-center flex-col">
        <Image
          src="/images/login2.png"
          alt="Login"
          width={2000}
          height={1000}
          className="w-2/4 h-auto rounded-lg ml-10"
        />
      </div>
    </main>
  );
}
