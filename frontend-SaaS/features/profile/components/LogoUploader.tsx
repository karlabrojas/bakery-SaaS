"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import Avatar from "./Avatar";
import Button from "@/components/ui/Button";

interface LogoUploaderProps {
  logoUrl?: string | null;
  bakeryName?: string;
  onUpload: (file: File) => Promise<void>;
}

export default function LogoUploader({
  logoUrl,
  bakeryName,
  onUpload,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    try {
      setUploading(true);
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <Avatar logoUrl={preview || logoUrl} bakeryName={bakeryName} size={150} />

      {/* Usamos tu Button global. Le pasamos flex para alinear el icono */}
      <Button
        onClick={handleClick}
        disabled={uploading}
        variant="primary"
        className="flex items-center gap-2 !px-6 !py-3"
      >
        <Camera size={18} />
        {uploading ? "Subiendo..." : "Cambiar logo"}
      </Button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleChange}
      />
    </div>
  );
}
