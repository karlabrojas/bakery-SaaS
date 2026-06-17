export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  bakery: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
}

export interface AuthResponse {
  accessToken: string;
}
