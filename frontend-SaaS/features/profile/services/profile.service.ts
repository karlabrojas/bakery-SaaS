import {
  ProfileResponse,
  UpdateBakeryDto,
  UpdateUserDto,
} from "../types/profile.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ProfileService {
  private getHeaders() {
    const token = localStorage.getItem("accessToken");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async updateUser(body: UpdateUserDto) {
    const response = await fetch(`${API_URL}/api/profile/user`, {
      method: "PATCH",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.user;
  }

  async updateBakery(body: UpdateBakeryDto) {
    const response = await fetch(`${API_URL}/api/profile/bakery`, {
      method: "PATCH",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.bakery;
  }

  async updateLogo(file: File) {
    const formData = new FormData();

    formData.append("logo", file);

    const response = await fetch(`${API_URL}/api/profile/logo`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.bakery;
  }
}

export const profileService = new ProfileService();
