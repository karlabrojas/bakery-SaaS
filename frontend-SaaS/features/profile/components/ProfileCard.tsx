"use client";

import { User } from "lucide-react";
import ProfileForm from "./ProfileForm";
import { UserProfile } from "../types/profile.type";
import Card from "@/components/ui/Card";

interface Props {
  user: UserProfile;
  onSave: (data: { first_name: string; last_name: string }) => Promise<void>;
}

export default function ProfileCard({ user, onSave }: Props) {
  return (
    <Card className="p-0 overflow-hidden bg-[#FFFDF9]">
      <div className="flex items-center gap-3 bg-[#6B3118] px-6 py-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <User className="text-[#6B3118]" size={20} />
        </div>

        <div>
          <h2 className="text-white font-bold text-lg">Perfil del Usuario</h2>
          <p className="text-[#F8F1E4] text-sm">Información personal</p>
        </div>
      </div>

      <div className="p-6">
        <ProfileForm user={user} onSave={onSave} />
      </div>
    </Card>
  );
}
