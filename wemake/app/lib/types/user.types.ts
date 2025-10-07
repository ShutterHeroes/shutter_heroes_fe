export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPublicInfo {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface UserUpdateRequest {
  displayName?: string;
  avatarUrl?: string;
}

export interface UserListResponse {
  users: UserPublicInfo[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
