import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  EmailExistsResponse,
} from '../types/auth.types';

export const authApi = {
  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post('/api/v1/users/register', data);
  },

  /**
   * 로그인 (JWT 토큰은 쿠키로 자동 저장됨)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/api/v1/users/login', data);
  },

  /**
   * 로그아웃 (쿠키 삭제)
   */
  logout: async (): Promise<LogoutResponse> => {
    return apiClient.post('/api/v1/users/logout');
  },

  /**
   * 이메일 중복 확인
   */
  checkEmail: async (email: string): Promise<EmailExistsResponse> => {
    return apiClient.get(`/api/v1/users/exists`, {
      params: { email },
    });
  },
};
