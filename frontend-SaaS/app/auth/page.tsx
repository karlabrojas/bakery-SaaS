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
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FAF3E8] p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full max-w-5xl gap-8 lg:gap-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="border-[#472D20] border-4 rounded-xl p-8 sm:p-12 w-full max-w-md shadow-xl flex flex-col items-center bg-[#FAF3E8]">
            <h1 className="text-5xl font-bold text-[#472D20] mb-8 tracking-tight">
              Login
            </h1>

            <div className="w-full space-y-5">
              <div className="flex flex-col space-y-2">
                <label className="text-xl text-[#472D20] font-medium text-center">
                  Correo electrónico:
                </label>
                <Input
                  className="w-full text-center border-[#472D20]/40 focus:border-[#472D20] bg-[#FAF3E8]"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xl text-[#472D20] font-medium text-center">
                  Contraseña:
                </label>
                <Input
                  className="w-full text-center border-[#472D20]/40 focus:border-[#472D20] bg-[#FAF3E8]"
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              {error && (
                <p className="text-red-600 text-center text-sm font-semibold">
                  {error}
                </p>
              )}

              <div className="pt-2 flex justify-center">
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="h-12 px-10 bg-[#472D20] text-white hover:bg-[#5c3b2a] transition-colors font-semibold rounded-md shadow"
                >
                  {loading ? "Iniciando..." : "Iniciar sesión"}
                </Button>
              </div>

              <div className="flex flex-row items-center justify-center gap-1 pt-4 text-sm text-[#472D20]">
                <p>¿Aún no tienes una cuenta?</p>
                <Button
                  onClick={() => router.push("/auth/register")}
                  variant="link"
                  className="font-bold hover:text-[#734a35] underline p-0"
                >
                  Regístrate aquí
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 relative min-h-[500px]">
          <Image
            src="/images/login2.png"
            alt="Login"
            fill
            priority
            className="object-contain object-center"
          />
        </div>
      </div>
    </main>
  );
}
