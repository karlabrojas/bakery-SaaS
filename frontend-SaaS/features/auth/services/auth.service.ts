import { LoginDto, RegisterDto } from "../types/auth.types";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthService {
  async login(data: LoginDto) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  async register(data: RegisterDto) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  async refresh() {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    let result: any = {};

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      logoutExpiredSession();
      throw new Error(result.message || "La sesión ha expirado");
    }

    return result;
  }

  async logout(accessToken: string) {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }
  }
}

let sessionExpired = false;

export const logoutExpiredSession = () => {
  if (sessionExpired) return;

  sessionExpired = true;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");

  setTimeout(() => {
    window.location.href = "/login";
  }, 3000);
};

export const authService = new AuthService();
