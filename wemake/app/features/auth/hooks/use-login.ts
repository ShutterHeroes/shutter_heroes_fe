import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '~/lib/api/auth.api';
import { useAuth } from '~/lib/hooks/use-auth.tsx';
import type { LoginRequest } from '~/lib/types/auth.types';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authApi.login(data);

      // 인증 상태 업데이트
      setAuthUser({
        ...user,
        createdAt: new Date().toISOString(), // 임시값
        lastLoginAt: new Date().toISOString(),
      });

      // 로그인 성공 시 홈페이지로 이동
      navigate('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
