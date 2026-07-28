export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  bakery_id: string;
}

export interface BakeryProfile {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_path: string | null;
  logoUrl: string | null;
}

export interface ProfileResponse {
  user: UserProfile;
  bakery: BakeryProfile;
}

export interface UpdateUserDto {
  first_name: string;
  last_name: string;
}

export interface UpdateBakeryDto {
  name: string;
  address: string;
  phone: string;
  email: string;
}
