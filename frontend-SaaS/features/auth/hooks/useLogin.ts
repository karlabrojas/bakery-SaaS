"use client";

import { useState } from "react";
import { authService } from "../services/auth.service";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const result = await authService.login({
        email,
        password,
      });

      localStorage.setItem("accessToken", result.accessToken);

      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
}
