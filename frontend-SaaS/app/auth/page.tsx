"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  return (
    <main className="flex flex-row p-24">
      {/* Izquierda */}
      <div className="border-[#472D20] border-6 w-2/4 h-120 rounded-lg flex items-center justify-center flex-col ml-20">
        <h1 className="text-8xl font-bold ">Login</h1>

        <label className=" m-4 mt-6 text-2xl ">Correo electrónico:</label>
        <Input />

        <label className="m-4 text-2xl ">Contraseña:</label>
        <Input />

        <Button className="mt-4 h-14">Iniciar sesión</Button>
        <div className="flex flex-row items-center justify-center mt-6">
          <p className=" ">¿Aún no tienes una cuenta?</p>
          <Button
            onClick={() => router.push("/auth/register")}
            variant="link"
            className=" hover:text-[#EAD9B6] "
          >
            Regístrate aquí
          </Button>
        </div>
      </div>
      <div className=" w-2/3 h-120 rounded-lg flex items-center justify-center flex-col">
        <Image
          src="/images/login2.png"
          alt="Login Image"
          width={2000}
          height={1000}
          className="w-2/4 h-auto rounded-lg ml-10 "
        />
      </div>
    </main>
  );
}
