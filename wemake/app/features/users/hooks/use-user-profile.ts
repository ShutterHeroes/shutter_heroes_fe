import { useState, useEffect } from 'react';
import { usersApi } from '~/lib/api/users.api';
import type { UserPublicInfo } from '~/lib/types/user.types';

export function useUserProfile(userId: string) {
  const [user, setUser] = useState<UserPublicInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userData = await usersApi.getUserProfile(userId);
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return { user, isLoading, error };
}
