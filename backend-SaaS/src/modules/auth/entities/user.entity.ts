export interface UserEntity {
  id: string;
  bakery_id: string;

  first_name: string;
  last_name: string;

  email: string;

  password_hash: string;

  role: string;

  is_active: boolean;

  created_at: Date;
}
