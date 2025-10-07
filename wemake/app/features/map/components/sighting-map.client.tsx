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
  userLocation?: { lat: number; lng: number } | null;
  searchRadius?: number; // 검색 반경 (미터 단위)
}

export function SightingMapClient({
  sightings,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '600px',
  onMarkerClick,
  onMapMove,
  userLocation,
  searchRadius,
}: SightingMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const isMovingProgrammaticallyRef = useRef(false);

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
      // 프로그래밍 방식의 이동이면 콜백 호출하지 않음
      if (isMovingProgrammaticallyRef.current) {
        isMovingProgrammaticallyRef.current = false;
        return;
      }

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

  // center와 zoom 변경 시 지도 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const currentCenter = mapInstanceRef.current.getCenter();
    const currentZoom = mapInstanceRef.current.getZoom();

    // 현재 위치와 다를 때만 이동 (무한 루프 방지)
    const isCenterDifferent = Math.abs(currentCenter.lat - center.lat) > 0.0001 ||
                              Math.abs(currentCenter.lng - center.lng) > 0.0001;
    const isZoomDifferent = currentZoom !== zoom;

    if (isCenterDifferent || isZoomDifferent) {
      console.log('[MapClient] Moving map to:', center, 'zoom:', zoom);
      isMovingProgrammaticallyRef.current = true;
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // 사용자 위치 마커 표시
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 사용자 마커 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // 사용자 위치가 있으면 마커 추가
    if (userLocation) {
      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      marker.bindPopup('<div class="p-2"><strong>내 위치</strong></div>');
      marker.addTo(mapInstanceRef.current);
      userMarkerRef.current = marker;

      console.log('[MapClient] User location marker added:', userLocation);
    }
  }, [userLocation]);

  // 검색 반경 원 표시
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 반경 원 제거
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    // 검색 반경이 있으면 원 추가 (실제 반경의 80%로 표시)
    if (searchRadius && searchRadius > 0) {
      const circle = L.circle([center.lat, center.lng], {
        radius: searchRadius * 0.8, // 실제 검색 반경보다 작게 표시 (검색되는 식제 데이터에 맞춤)
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      });

      circle.addTo(mapInstanceRef.current);
      radiusCircleRef.current = circle;

      console.log('[MapClient] Search radius circle added:', searchRadius);
    }
  }, [center, searchRadius]);

  return <div ref={mapRef} style={{ height, width: '100%', position: 'relative', zIndex: 0 }} className="rounded-lg shadow-md" />;
}
