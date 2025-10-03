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

// Swagger에서 확인한 SightingDetailResponse 기반 타입
export interface SightingDetail {
  id: string;
  title: string;
  description: string | null;
  occurredAt: string | null;
  detectedBy: string;
  aiConfidence: number | null;
  visibility: 'public' | 'private';
  isVerified: boolean;
  addressText: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
  species: SpeciesInfo | null;
  media: MediaInfo;
  geom: string | null; // WKT 문자열: "POINT(126.9784 37.5667)"
}

export interface UserInfo {
  id: string;
  displayName: string;
  email: string;
}

export interface SpeciesInfo {
  id: string;
  commonNameKo: string | null;
  commonNameEn: string | null;
  scientificName: string;
  status: 'general' | 'endangered' | 'natural_monument' | null;
}

export interface GpsLocation {
  latitude: number;
  longitude: number;
}

export interface MediaInfo {
  mediaId?: string;
  id?: string; // 백엔드 응답에서는 id 사용
  sanitizedUrl?: string; // 개인정보 제거된 이미지 URL
  storagePath?: string | null; // 원본 이미지 URL
  url?: string; // 일부 API에서 사용
  mimeType: string;
  width: number | null;
  height: number | null;
  bytes?: number;
  exif?: {
    cameraMake: string | null;
    cameraModel: string | null;
    capturedAt: string | null;
    gpsLatitude: number | null;
    gpsLongitude: number | null;
  };
}

export interface AnimalDetection {
  detectionId?: string;
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

// GeoJSON Point 타입
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
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
  storagePath?: string; // 백엔드 nearby API 응답
  sanitizedUrl?: string; // 기존 browse API 응답
  geom: GeoJsonPoint | string | null; // GeoJSON Point 객체 또는 WKT 문자열: "POINT(126.9784 37.5667)"
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
