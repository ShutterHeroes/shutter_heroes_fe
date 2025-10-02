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
  detectionId: string;
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
