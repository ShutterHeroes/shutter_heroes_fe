// AI 동물 인식 관련 타입

export interface AnimalRecognitionRequest {
  image: File;
  threshold?: number;
  maxDetections?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimalDetection {
  scientificName: string;
  commonName: string | null;
  confidence: number;
  boundingBox: BoundingBox | null;
}

export interface AnimalRecognitionResponse {
  detections: AnimalDetection[];
  imageWidth: number;
  imageHeight: number;
}

export interface AnimalDescriptionRequest {
  scientificName: string;
}

export interface AnimalDescriptionResponse {
  scientificName: string;
  commonName: string;
  description: string;
  habitat: string;
  conservationStatus: string;
}

export interface AIConfig {
  modelName: string;
  version: string;
  supportedSpecies: string[];
  maxImageSize: number;
  defaultThreshold: number;
}
