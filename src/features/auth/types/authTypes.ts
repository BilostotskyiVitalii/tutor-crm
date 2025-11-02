export interface AuthUser {
  id: string;
  email: string;
  nickName: string;
  avatar: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickName: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}
