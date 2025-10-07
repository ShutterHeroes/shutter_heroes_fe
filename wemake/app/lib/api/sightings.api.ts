import { apiClient } from './client';
import type {
  CreateSightingRequest,
  CreateSightingResponse,
  UpdateSightingRequest,
  UpdateSightingResponse,
  SightingDetail,
  SightingListResponse,
  GetSightingsParams,
  GetNearbySightingsParams,
  NearbySightingsResponse,
} from '../types/sighting.types';

export const sightingsApi = {
  /**
   * Sighting 생성 (이미지 업로드, 인증 필요)
   * 백엔드에서 Vision API로 동물 인식 후 자동 생성
   */
  create: async (data: CreateSightingRequest): Promise<CreateSightingResponse> => {
    const formData = new FormData();
    formData.append('image', data.image);

    return apiClient.post('/api/v1/sightings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Sighting 상세 조회
   */
  getById: async (sightingId: string): Promise<SightingDetail> => {
    return apiClient.get(`/api/v1/sightings/${sightingId}`);
  },

  /**
   * Sighting 수정 (제목, 설명, 공개 여부 수정)
   */
  update: async (
    sightingId: string,
    data: UpdateSightingRequest
  ): Promise<UpdateSightingResponse> => {
    return apiClient.patch(`/api/v1/sightings/${sightingId}`, data);
  },

  /**
   * Sighting 삭제
   */
  delete: async (sightingId: string): Promise<void> => {
    return apiClient.delete(`/api/v1/sightings/${sightingId}`);
  },

  /**
   * Sighting 목록 조회 (페이지네이션, 검색)
   */
  getAll: async (params: GetSightingsParams = {}): Promise<SightingListResponse> => {
    return apiClient.get('/api/v1/sightings', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,DESC'],
        keyword: params.keyword,
      },
    });
  },

  /**
   * 근처 Sighting 조회 (위치 기반 검색)
   * @param params - lat/lon 또는 centerId 중 하나 필수, radiusMeters로 반경 지정 (기본 500m)
   * @returns 배열 형태로 반환 (페이지네이션 없음)
   */
  getNearby: async (params: GetNearbySightingsParams): Promise<NearbySightingsResponse> => {
    return apiClient.get('/api/v1/sightings/nearby', {
      params: {
        lat: params.lat,
        lon: params.lon,
        centerId: params.centerId,
        radiusMeters: params.radiusMeters ?? 500, // 기본 500m
      },
    });
  },

  /**
   * 내가 제보한 Sighting 목록 조회 (페이지네이션, 검색, 인증 필요)
   */
  getMySightings: async (params: GetSightingsParams = {}): Promise<SightingListResponse> => {
    return apiClient.get('/api/v1/sightings/my', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,DESC'],
        keyword: params.keyword,
      },
    });
  },
};
