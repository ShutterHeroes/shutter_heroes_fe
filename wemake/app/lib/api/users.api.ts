import { apiClient } from './client';
import type { User, UserPublicInfo, UserUpdateRequest, UserListResponse } from '../types/user.types';
import type { Pageable } from '../types/api.types';

export const usersApi = {
  /**
   * 내 프로필 조회 (인증 필요)
   */
  getMyProfile: async (): Promise<User> => {
    return apiClient.get('/api/v1/users/me');
  },

  /**
   * 내 프로필 수정 (인증 필요)
   */
  updateMyProfile: async (data: UserUpdateRequest): Promise<User> => {
    return apiClient.put('/api/v1/users/me', data);
  },

  /**
   * 사용자 목록 조회 (페이지네이션, 검색)
   */
  getUserList: async (params: { pageable: Pageable; search?: string }): Promise<UserListResponse> => {
    return apiClient.get('/api/v1/users', {
      params: {
        page: params.pageable.page,
        size: params.pageable.size,
        sort: params.pageable.sort,
        search: params.search,
      },
    });
  },

  /**
   * 특정 사용자 프로필 조회
   */
  getUserProfile: async (userId: string): Promise<UserPublicInfo> => {
    return apiClient.get(`/api/v1/users/${userId}`);
  },
};
