import { apiClient } from './client';
import type {
  MediaBrowseResponse,
  BrowseMediaParams,
  UpdateVisibilityRequest
} from '../types/media.types';

export const mediaApi = {
  /**
   * 공개 미디어 목록 조회 (페이지네이션)
   */
  browse: async (params: BrowseMediaParams = {}): Promise<MediaBrowseResponse> => {
    return apiClient.get('/api/v1/medias/browse', {
      params: {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'createdAt,desc',
      },
    });
  },

  /**
   * 내 미디어 목록 조회 (인증 필요)
   */
  myMedias: async (params: BrowseMediaParams = {}): Promise<MediaBrowseResponse> => {
    return apiClient.get('/api/v1/medias/my', {
      params: {
        page: params.page || 0,
        size: params.size || 20,
        sort: params.sort || 'createdAt,desc',
      },
    });
  },

  /**
   * 미디어 공개/비공개 설정 (인증 필요)
   */
  updateVisibility: async (
    mediaId: string,
    data: UpdateVisibilityRequest
  ): Promise<void> => {
    return apiClient.patch(`/api/v1/media/${mediaId}/visibility`, data);
  },

  /**
   * 미디어 삭제 (인증 필요)
   */
  deleteMedia: async (mediaId: string): Promise<void> => {
    return apiClient.delete(`/api/v1/media/${mediaId}`);
  },
};
