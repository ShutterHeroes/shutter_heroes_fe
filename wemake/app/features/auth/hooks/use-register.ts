import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '~/lib/api/auth.api';
import type { RegisterRequest } from '~/lib/types/auth.types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // 이메일 중복 확인
      const emailCheck = await authApi.checkEmail(data.email);
      if (emailCheck.exists) {
        setError('이미 사용 중인 이메일입니다');
        setIsLoading(false);
        return;
      }

      // 회원가입
      await authApi.register(data);

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/auth/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '회원가입에 실패했습니다';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
