"use client";

import { useEffect, useState } from "react";
import { profileService } from "../services/profile.service";
import {
  BakeryProfile,
  ProfileResponse,
  UpdateBakeryDto,
  UpdateUserDto,
  UserProfile,
} from "../types/profile.type";

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [bakery, setBakery] = useState<BakeryProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);

      const profile: ProfileResponse = await profileService.getProfile();

      setUser(profile.user);

      setBakery(profile.bakery);

      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateUser = async (body: UpdateUserDto) => {
    const updated = await profileService.updateUser(body);

    setUser(updated);
  };

  const updateBakery = async (body: UpdateBakeryDto) => {
    const updated = await profileService.updateBakery(body);

    setBakery(updated);
  };

  const updateLogo = async (file: File) => {
    const updated = await profileService.updateLogo(file);

    setBakery(updated);
  };

  return {
    user,
    bakery,
    loading,
    error,
    reload: loadProfile,
    updateUser,
    updateBakery,
    updateLogo,
  };
}
