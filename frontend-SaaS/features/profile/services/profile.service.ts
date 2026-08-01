import {
  ProfileResponse,
  UpdateBakeryDto,
  UpdateUserDto,
} from "../types/profile.type";

const api = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem("accessToken");

export async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${api}/api/profile`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener el perfil");
  }

  return json;
}

export async function updateUser(data: UpdateUserDto) {
  const res = await fetch(`${api}/api/profile/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al actualizar usuario");
  }

  return json.user;
}

export async function updateBakery(data: UpdateBakeryDto) {
  const res = await fetch(`${api}/api/profile/bakery`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al actualizar la panadería");
  }

  return json.bakery;
}

export async function updateLogo(file: File) {
  const formData = new FormData();

  formData.append("logo", file);

  const res = await fetch(`${api}/api/profile/logo`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al actualizar el logo");
  }

  return json.bakery;
}
