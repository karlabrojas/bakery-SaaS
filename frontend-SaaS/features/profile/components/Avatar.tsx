"use client";

import { Building2 } from "lucide-react";

interface AvatarProps {
  logoUrl?: string | null;
  bakeryName?: string;
  size?: number;
}

export default function Avatar({
  logoUrl,
  bakeryName,
  size = 120,
}: AvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden bg-[#F5EBD7] border-4 border-[#E8D6AF] shadow-md flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={bakeryName}
          className="w-full h-full object-cover"
        />
      ) : (
        <Building2 size={size * 0.45} className="text-[#8B5A2B]" />
      )}
    </div>
  );
}
