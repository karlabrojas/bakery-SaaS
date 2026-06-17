"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";

export default function Register() {
  return (
    <main className="flex flex-row p-12 bg-[#472D20] h-screen">
      {/* Formulario */}
      <div className="border-[#EAD9B6] border-6 w-3/5 h-full rounded-lg flex items-center justify-center flex-col ml-20 px-24">
        <h1 className="text-6xl font-bold text-[#EAD9B6]">Registro</h1>
        <p className="text-2xl text-[#EAD9B6] mt-4">
          Registra tu panadería aquí
        </p>

        <div className="flex flex-row justify-around mt-10 w-full">
          {/* Datos de la panadería */}
          <div className="flex flex-col space-y-4 w-1/2">
            <p className="text-2xl text-[#EAD9B6] mb-4">
              Datos de la panadería:
            </p>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">Nombre:</label>
              <Input className="w-70" />
            </div>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Dirección:
              </label>
              <Input className="w-70" />
            </div>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">Teléfono:</label>
              <Input className="w-70" />
            </div>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Correo electrónico:
              </label>
              <Input className="w-70" />
            </div>
          </div>

          {/* Datos del propietario */}
          <div className="flex flex-col space-y-4 w-1/2">
            <p className="text-2xl text-[#EAD9B6] mb-4">
              Datos del propietario:
            </p>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Nombre completo:
              </label>
              <Input className="w-70" />
            </div>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Correo electrónico:
              </label>
              <Input className="w-70" />
            </div>
            <div>
              <label className="block text-2xl text-[#EAD9B6]">
                Contraseña:
              </label>
              <Input className="w-70" />
            </div>
            <Button variant="secondary" className="mt-6 h-14 w-80">
              Registrar panadería
            </Button>
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="w-2/5 h-full rounded-lg flex items-center justify-center flex-col">
        <Image
          src="/images/login1.png"
          alt="Login Image"
          width={2000}
          height={1200}
          className="w-full h-full object-contain rounded-lg ml-10"
        />
      </div>
    </main>
  );
}
