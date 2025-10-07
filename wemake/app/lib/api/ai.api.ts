import { apiClient } from './client';
import type {
  AnimalRecognitionRequest,
  AnimalRecognitionResponse,
  AnimalDescriptionResponse,
  AIConfig,
} from '../types/ai.types';

export const aiApi = {
  /**
   * 동물 인식 API (이미지 업로드)
   */
  recognizeAnimal: async (
    request: AnimalRecognitionRequest
  ): Promise<AnimalRecognitionResponse> => {
    const formData = new FormData();
    formData.append('image', request.image);

    return apiClient.post('/api/v1/ai/animal/recognition', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: {
        threshold: request.threshold,
        maxDetections: request.maxDetections,
      },
    });
  },

  /**
   * 동물 상세 정보 조회
   */
  getAnimalDescription: async (
    scientificName: string
  ): Promise<AnimalDescriptionResponse> => {
    return apiClient.post('/api/v1/ai/animal/description', null, {
      params: { scientificName },
    });
  },

  /**
   * AI 설정 조회
   */
  getConfig: async (): Promise<AIConfig> => {
    return apiClient.get('/api/v1/ai/config');
  },
};
