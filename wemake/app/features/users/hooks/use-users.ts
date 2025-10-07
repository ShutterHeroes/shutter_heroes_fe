import { useState, useCallback } from 'react';
import { usersApi } from '~/lib/api/users.api';
import type { UserListResponse } from '~/lib/types/user.types';

export function useUsers() {
  const [users, setUsers] = useState<UserListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page: number = 0, size: number = 20, search?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.getUserList({
        pageable: { page, size },
        search,
      });
      setUsers(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다');
      console.error('사용자 목록 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, error, fetchUsers };
}
