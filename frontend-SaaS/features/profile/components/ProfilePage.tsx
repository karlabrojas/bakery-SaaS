"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import ProfileCard from "./ProfileCard";
import BakeryCard from "./BakeryCard";

export default function ProfilePage() {
  const { user, bakery, loading, error, updateUser, updateBakery, updateLogo } =
    useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin text-[#6B3118]" size={42} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-20">
        <div className="bg-red-50 border border-red-300 rounded-xl p-8 flex items-center gap-4">
          <AlertCircle className="text-red-600" size={30} />
          <div>
            <h2 className="font-bold text-red-700">Ocurrió un error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !bakery) return null;

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#6B3118]">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Administra tu información personal y los datos de tu panadería.
          </p>
        </div>

        <div className="space-y-8">
          <ProfileCard user={user} onSave={updateUser} />

          <BakeryCard
            bakery={bakery}
            onSave={updateBakery}
            onUpload={updateLogo}
          />
        </div>
      </div>
    </div>
  );
}
