/**
 * WKT POINT 형식을 위도/경도로 변환
 * 예: "POINT(126.9784 37.5667)" -> { lat: 37.5667, lng: 126.9784 }
 */
export function parseWKTPoint(wkt: string | null): { lat: number; lng: number } | null {
  if (!wkt) return null;

  const match = wkt.match(/POINT\(([0-9.-]+)\s+([0-9.-]+)\)/);
  if (!match) return null;

  const lng = parseFloat(match[1]);
  const lat = parseFloat(match[2]);

  if (isNaN(lat) || isNaN(lng)) return null;

  return { lat, lng };
}

/**
 * 기본 지도 중심 (서울)
 */
export const DEFAULT_MAP_CENTER = { lat: 37.5665, lng: 126.978 };

/**
 * 기본 지도 줌 레벨
 */
export const DEFAULT_ZOOM = 13;
