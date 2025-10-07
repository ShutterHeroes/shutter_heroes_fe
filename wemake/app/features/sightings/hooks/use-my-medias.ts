import { useState, useCallback } from 'react';
import { mediaApi } from '~/lib/api/media.api';
import type { MediaBrowseResponse, BrowseMediaParams } from '~/lib/types/media.types';

export function useMyMedias() {
  const [medias, setMedias] = useState<MediaBrowseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyMedias = useCallback(async (params: BrowseMediaParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaApi.myMedias(params);
      setMedias(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '내 미디어 목록을 불러오는데 실패했습니다');
      console.error('내 미디어 목록 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMedia = useCallback(async (mediaId: string) => {
    try {
      await mediaApi.deleteMedia(mediaId);
      // 삭제 후 목록 새로고침
      if (medias) {
        setMedias({
          ...medias,
          content: medias.content.filter(m => m.mediaId !== mediaId),
          totalElements: medias.totalElements - 1,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '미디어 삭제에 실패했습니다');
      console.error('미디어 삭제 에러:', err);
      throw err;
    }
  }, [medias]);

  const updateVisibility = useCallback(async (
    mediaId: string,
    visibility: 'public' | 'private'
  ) => {
    try {
      await mediaApi.updateVisibility(mediaId, { visibility });
      // 변경 후 목록 업데이트
      if (medias) {
        setMedias({
          ...medias,
          content: medias.content.map(m =>
            m.mediaId === mediaId ? { ...m, sightingVisibility: visibility } : m
          ),
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '공개 설정 변경에 실패했습니다');
      console.error('공개 설정 변경 에러:', err);
      throw err;
    }
  }, [medias]);

  return { medias, isLoading, error, fetchMyMedias, deleteMedia, updateVisibility };
}
