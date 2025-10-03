import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { parseWKTPoint, DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '~/lib/utils/geo.utils';

// Leaflet 기본 아이콘 수정 (빌드 시 아이콘 경로 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SightingMapClientProps {
  sightings: SightingListItem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (sighting: SightingListItem) => void;
  onMapMove?: (center: { lat: number; lng: number }, zoom: number) => void;
}

export function SightingMapClient({
  sightings,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '600px',
  onMarkerClick,
  onMapMove,
}: SightingMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // 지도 생성
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // 다양한 타일 레이어 정의
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });

    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    });

    const lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    });

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri',
        maxZoom: 19,
      }
    );

    const topoMap = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenTopoMap contributors',
        maxZoom: 17,
      }
    );

    const voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    });

    // 기본 타일 추가
    openStreetMap.addTo(map);

    // 레이어 컨트롤 추가
    const baseMaps = {
      '기본 지도': openStreetMap,
      '심플 (밝음)': lightMap,
      '보이저': voyager,
      '다크 모드': darkMap,
      '위성 사진': satellite,
      '지형 지도': topoMap,
    };

    L.control.layers(baseMaps).addTo(map);

    // 축척 바 추가 (미터/킬로미터 표시)
    L.control
      .scale({
        imperial: false, // 야드/마일 단위 숨김
        metric: true, // 미터/킬로미터 단위 표시
        position: 'bottomleft',
      })
      .addTo(map);

    mapInstanceRef.current = map;

    // 클린업
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // 한 번만 실행 - center, zoom 변경 시 재생성하지 않음

  // 지도 이동/확대 이벤트 리스너 등록
  useEffect(() => {
    if (!mapInstanceRef.current || !onMapMove) return;

    const handleMoveEnd = () => {
      const center = mapInstanceRef.current!.getCenter();
      const zoom = mapInstanceRef.current!.getZoom();
      onMapMove({ lat: center.lat, lng: center.lng }, zoom);
    };

    // moveend: 드래그나 확대/축소가 끝났을 때 발생
    mapInstanceRef.current.on('moveend', handleMoveEnd);
    mapInstanceRef.current.on('zoomend', handleMoveEnd);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('moveend', handleMoveEnd);
        mapInstanceRef.current.off('zoomend', handleMoveEnd);
      }
    };
  }, [onMapMove]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 새 마커 추가
    const newMarkers: L.Marker[] = [];
    const bounds: L.LatLngBounds[] = [];

    sightings.forEach((sighting) => {
      const position = parseWKTPoint(sighting.geom);
      if (!position) return;

      const marker = L.marker([position.lat, position.lng]);

      // 팝업 내용
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-base mb-1">${sighting.title}</h3>
          ${
            sighting.commonNameKo
              ? `<p class="text-sm text-gray-700 mb-1">🦊 ${sighting.commonNameKo}</p>`
              : ''
          }
          ${
            sighting.aiConfidence
              ? `<p class="text-xs text-gray-500">AI 신뢰도: ${Math.round(sighting.aiConfidence * 100)}%</p>`
              : ''
          }
          <p class="text-xs text-gray-500 mt-1">by ${sighting.displayName}</p>
          <a
            href="/sightings/${sighting.id}"
            class="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            상세 보기 →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      // 클릭 이벤트
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(sighting));
      }

      marker.addTo(mapInstanceRef.current!);
      newMarkers.push(marker);
      bounds.push(L.latLngBounds([position.lat, position.lng], [position.lat, position.lng]));
    });

    markersRef.current = newMarkers;
    console.log('[MapClient] Markers on map:', newMarkers.length);

    // 지도 자동 이동 제거 - 사용자가 선택한 위치 유지
    // if (bounds.length > 0 && newMarkers.length > 1) {
    //   const group = L.featureGroup(newMarkers);
    //   mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    // }
  }, [sightings, onMarkerClick]);

  return <div ref={mapRef} style={{ height, width: '100%', position: 'relative', zIndex: 0 }} className="rounded-lg shadow-md" />;
}
