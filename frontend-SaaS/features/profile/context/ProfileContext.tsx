"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { profileService } from "../services/profile.service";

import {
  BakeryProfile,
  UserProfile,
  UpdateBakeryDto,
  UpdateUserDto,
} from "../types/profile.type";

interface ProfileContextType {
  user: UserProfile | null;
  bakery: BakeryProfile | null;
  loading: boolean;

  reloadProfile: () => Promise<void>;

  updateUser: (body: UpdateUserDto) => Promise<void>;

  updateBakery: (body: UpdateBakeryDto) => Promise<void>;

  updateLogo: (file: File) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function ProfileProvider({ children }: Props) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [bakery, setBakery] = useState<BakeryProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const reloadProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      setLoading(true);

      const profile = await profileService.getProfile();

      setUser(profile.user);
      setBakery(profile.bakery);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadProfile();
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

  return (
    <ProfileContext.Provider
      value={{
        user,
        bakery,
        loading,
        reloadProfile,
        updateUser,
        updateBakery,
        updateLogo,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfileContext debe utilizarse dentro de ProfileProvider.",
    );
  }

  return context;
}
