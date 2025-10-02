import { apiClient } from './client';
import type {
  CreateSightingRequest,
  CreateSightingResponse,
  UpdateSightingRequest,
  UpdateSightingResponse,
  SightingDetail,
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
   * Sighting 수정 (제목, 설명 수정)
   * TODO: 백엔드 API 구현 후 연결
   */
  update: async (
    sightingId: string,
    data: UpdateSightingRequest
  ): Promise<UpdateSightingResponse> => {
    return apiClient.patch(`/api/v1/sightings/${sightingId}`, data);
  },
};
