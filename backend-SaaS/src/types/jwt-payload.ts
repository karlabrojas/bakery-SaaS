export interface JwtPayload {
  userId: string;
  bakeryId: string;
  role: string;
  sessionId: string;
}

export interface RegisterUserDto {
  bakery_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}
