/**
 * WKT POINT 형식 또는 GeoJSON Point 형식을 위도/경도로 변환
 * WKT 예: "POINT(126.9784 37.5667)" -> { lat: 37.5667, lng: 126.9784 }
 * GeoJSON 예: {"type":"Point","coordinates":[126.9784, 37.5667]} -> { lat: 37.5667, lng: 126.9784 }
 */
export function parseWKTPoint(geom: string | object | null | undefined): { lat: number; lng: number } | null {
  if (!geom) {
    return null;
  }

  // GeoJSON 객체 형식인 경우
  if (typeof geom === 'object' && 'type' in geom && 'coordinates' in geom) {
    const point = geom as { type: string; coordinates: number[] };
    if (point.type === 'Point' && Array.isArray(point.coordinates) && point.coordinates.length >= 2) {
      const lng = point.coordinates[0];
      const lat = point.coordinates[1];

      if (isNaN(lat) || isNaN(lng)) {
        console.warn('[parseWKTPoint] Invalid GeoJSON coordinates:', point.coordinates);
        return null;
      }

      return { lat, lng };
    }
  }

  // 문자열인 경우 WKT 또는 JSON 문자열일 수 있음
  if (typeof geom === 'string') {
    // JSON 문자열로 파싱 시도
    try {
      const parsed = JSON.parse(geom);
      if (parsed && typeof parsed === 'object' && 'type' in parsed && 'coordinates' in parsed) {
        return parseWKTPoint(parsed); // 재귀 호출
      }
    } catch {
      // JSON이 아니면 WKT 형식으로 시도
    }

    // WKT POINT(lng lat) 형식 매칭
    const match = geom.match(/POINT\s*\(\s*([0-9.-]+)\s+([0-9.-]+)\s*\)/i);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn('[parseWKTPoint] Invalid WKT lat/lng values:', { lat, lng, geom });
        return null;
      }

      return { lat, lng };
    }
  }

  console.warn('[parseWKTPoint] Failed to parse geom:', geom);
  return null;
}

/**
 * 기본 지도 중심 (서울)
 */
export const DEFAULT_MAP_CENTER = { lat: 37.5665, lng: 126.978 };

/**
 * 기본 지도 줌 레벨
 */
export const DEFAULT_ZOOM = 13;
