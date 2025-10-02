import { User, UserRole } from './user.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface EmailExistsResponse {
  exists: boolean;
}
