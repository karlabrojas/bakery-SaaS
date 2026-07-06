"use client";

import { useState } from "react";
import { authService } from "../services/auth.service";
import { RegisterDto } from "../types/auth.types";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterDto) => {
    try {
      setLoading(true);

      const result = await authService.register(data);

      localStorage.setItem("accessToken", result.accessToken);

      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
  };
}
