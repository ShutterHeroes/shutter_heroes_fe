import { useState, useCallback } from 'react';
import { mediaApi } from '~/lib/api/media.api';
import type { MediaBrowseResponse, BrowseMediaParams } from '~/lib/types/media.types';

export function useMedias() {
  const [medias, setMedias] = useState<MediaBrowseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedias = useCallback(async (params: BrowseMediaParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaApi.browse(params);
      setMedias(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '미디어 목록을 불러오는데 실패했습니다');
      console.error('미디어 목록 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { medias, isLoading, error, fetchMedias };
}
