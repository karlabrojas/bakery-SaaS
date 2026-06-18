import { LoginDto, RegisterDto } from "../types/auth.types";

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
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",

      credentials: "include",
    });

    return response.json();
  }

  async logout(accessToken: string) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",

      credentials: "include",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export const authService = new AuthService();
