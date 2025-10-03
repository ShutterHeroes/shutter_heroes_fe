// Sighting 타입 정의

export interface Sighting {
  sightingId: string;
  title: string;
  description: string | null;
  createdAt: string;
  visibility: 'public' | 'private';
  ownerId: string;
  detections?: AnimalDetection[];
}

export interface SightingDetail {
  sightingId: string;
  title: string;
  description: string | null;
  aiConfidence: number | null;
  gpsLocation: GpsLocation | null;
  occurredAt: string | null;
  createdAt: string;
  visibility: 'public' | 'private';
  media: MediaInfo;
  detections: AnimalDetection[];
  speciesProcessingStatus: 'PENDING' | 'COMPLETED' | 'NOT_DETECTED';
  owner: {
    userId: string;
    username: string;
    nickname: string;
  };
}

export interface GpsLocation {
  latitude: number;
  longitude: number;
}

export interface MediaInfo {
  mediaId: string;
  storagePath: string;
  mimeType: string;
  width: number | null;
  height: number | null;
}

export interface AnimalDetection {
  detectionId?: string; // 선택 사항으로 변경
  scientificName: string;
  commonName: string | null;
  confidence: number;
  boundingBox: BoundingBox | null;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CreateSightingRequest {
  image: File;
}

export interface CreateSightingResponse {
  sightingId: string;
  mediaId: string;
  title: string;
  description: string | null;
  visibility: 'public' | 'private';
  createdAt: string;
  detections: AnimalDetection[];
}

export interface UpdateSightingRequest {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private';
}

export interface UpdateSightingResponse {
  sightingId: string;
  title: string;
  description: string | null;
  visibility: 'public' | 'private';
  updatedAt: string;
}

// Sighting 목록 조회용 타입
export interface SightingListItem {
  id: string;
  title: string;
  description: string | null;
  occurredAt: string | null;
  detectedBy: string;
  aiConfidence: number | null;
  visibility: 'public' | 'private';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  commonNameKo: string | null;
  commonNameEn: string | null;
  scientificName: string | null;
  status: 'general' | 'endangered' | 'natural_monument' | null;
  sanitizedUrl: string;
  geom: string | null; // WKT 형식: "POINT(126.9784 37.5667)"
}

export interface SightingListResponse {
  content: SightingListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetSightingsParams {
  page?: number;
  size?: number;
  sort?: string[];
  keyword?: string;
}

// Nearby Sightings 조회용 타입
export interface GetNearbySightingsParams {
  lat?: number; // 중심 위도
  lon?: number; // 중심 경도
  centerId?: string; // 특정 sighting UUID (이것을 사용하면 해당 sighting 좌표 기준)
  radiusMeters?: number; // 검색 반경 (미터, 기본 500m)
}

// Nearby API 응답은 배열로 반환 (페이지네이션 없음)
export type NearbySightingsResponse = SightingListItem[];
