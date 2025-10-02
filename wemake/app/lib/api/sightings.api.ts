import { apiClient } from './client';
import type { CreateSightingRequest, CreateSightingResponse } from '../types/sighting.types';

export const sightingsApi = {
  /**
   * Sighting 생성 (이미지 업로드, 인증 필요)
   */
  create: async (data: CreateSightingRequest): Promise<CreateSightingResponse> => {
    const formData = new FormData();
    formData.append('image', data.image);

    return apiClient.post('/api/v1/sightings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: {
        title: data.title,
        description: data.description,
      },
    });
  },
};
