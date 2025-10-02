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
  title?: string;
  description?: string;
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
