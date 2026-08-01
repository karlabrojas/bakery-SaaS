"use client";

import { Building2 } from "lucide-react";
import BakeryForm from "./BakeryForm";
import LogoUploader from "./LogoUploader";
import { BakeryProfile } from "../types/profile.type";
import Card from "@/components/ui/Card";

interface Props {
  bakery: BakeryProfile;
  onSave: (data: {
    name: string;
    address: string;
    phone: string;
    email: string;
  }) => Promise<void>;
  onUpload: (file: File) => Promise<void>;
}

export default function BakeryCard({ bakery, onSave, onUpload }: Props) {
  return (
    <Card className="p-0 overflow-hidden bg-[#FFFDF9]">
      <div className="flex items-center gap-3 bg-[#472D20] px-6 py-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Building2 className="text-[#6B3118]" size={20} />
        </div>

        <div>
          <h2 className="text-white font-bold text-lg">
            Información de la Panadería
          </h2>
          <p className="text-[#F8F1E4] text-sm">Datos generales</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-10 p-8">
        <div className="flex justify-center">
          <LogoUploader
            logoUrl={bakery.logoUrl}
            bakeryName={bakery.name}
            onUpload={onUpload}
          />
        </div>

        <BakeryForm bakery={bakery} onSave={onSave} />
      </div>
    </Card>
  );
}
