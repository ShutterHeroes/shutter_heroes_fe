import { useState, useEffect } from 'react';
import { usersApi } from '~/lib/api/users.api';
import { useAuth } from '~/lib/hooks/use-auth.tsx';
import type { User, UserUpdateRequest } from '~/lib/types/user.types';

export function useMyProfile() {
  const { user, refetchUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UserUpdateRequest) => {
    setIsUpdating(true);
    setError(null);

    try {
      await usersApi.updateMyProfile(data);
      await refetchUser(); // 프로필 업데이트 후 사용자 정보 다시 가져오기
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '프로필 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { user, isUpdating, error, updateProfile };
}
