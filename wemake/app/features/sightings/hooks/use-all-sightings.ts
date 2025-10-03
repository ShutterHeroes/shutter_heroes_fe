import { useState, useCallback } from 'react';
import { sightingsApi } from '~/lib/api/sightings.api';
import type {
  SightingListResponse,
  GetSightingsParams
} from '~/lib/types/sighting.types';

export function useAllSightings() {
  const [sightings, setSightings] = useState<SightingListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = useCallback(async (params: GetSightingsParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sightingsApi.getAll(params);
      setSightings(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '목격 정보 목록을 불러오는데 실패했습니다');
      console.error('목격 정보 목록 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sightings, isLoading, error, fetchSightings };
}
