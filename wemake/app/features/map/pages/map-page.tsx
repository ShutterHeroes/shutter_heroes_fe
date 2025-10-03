'use client';

import { useEffect, useState, useCallback } from 'react';
import { type MetaFunction } from 'react-router';
import { SightingMap } from '../components/sighting-map';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { SearchIcon, Loader2Icon, XIcon, MapIcon } from 'lucide-react';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { parseWKTPoint, DEFAULT_MAP_CENTER } from '~/lib/utils/geo.utils';
import { sightingsApi } from '~/lib/api/sightings.api';

export const meta: MetaFunction = () => {
  return [{ title: '목격 지도 | 셔터 히어로즈' }];
};

// 줌 레벨에 따른 반경 계산 (meters)
function getRadiusFromZoom(zoom: number): number {
  if (zoom >= 17) return 500; // 가장 확대: 500m
  if (zoom >= 15) return 1000; // 중간 확대: 1km
  if (zoom >= 13) return 2000; // 중간: 2km
  if (zoom >= 11) return 5000; // 축소: 5km
  if (zoom >= 9) return 10000; // 많이 축소: 10km
  return 20000; // 전체 뷰: 20km
}

// 미터를 km 또는 m으로 표시
function formatRadius(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters}m`;
}

export default function MapPage() {
  const [sightings, setSightings] = useState<SightingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSighting, setSelectedSighting] = useState<SightingListItem | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(13);
  const [totalCount, setTotalCount] = useState(0);

  // 지도 중심과 줌 레벨에 따라 nearby API 호출
  const fetchNearbySightings = useCallback(async (lat: number, lng: number, zoom: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const radiusMeters = getRadiusFromZoom(zoom);
      const response = await sightingsApi.getNearby({
        lat: lat,
        lon: lng,
        radiusMeters: radiusMeters,
      });

      console.log('[Map] Nearby API response:', response);
      console.log('[Map] Sample sighting:', response[0]);

      // 응답이 배열로 오므로 직접 설정
      setSightings(response);
      setTotalCount(response.length);
    } catch (err: any) {
      console.error('Error fetching nearby sightings:', err);
      setError(err.response?.data?.message || '목격 정보를 불러오는데 실패했습니다');
      setSightings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchNearbySightings(mapCenter.lat, mapCenter.lng, mapZoom);
  }, []);

  // 지도 이동/확대 이벤트 핸들러 (위치만 저장, 자동 검색하지 않음)
  const handleMapMove = useCallback((center: { lat: number; lng: number }, zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, []);

  // 현재 위치에서 재검색 버튼 핸들러
  const handleRefreshSearch = () => {
    fetchNearbySightings(mapCenter.lat, mapCenter.lng, mapZoom);
  };

  const handleMarkerClick = (sighting: SightingListItem) => {
    setSelectedSighting(sighting);
  };

  // 위치 정보가 있는 목격 정보만 필터링
  const sightingsWithLocation = sightings.filter((s) => {
    const position = parseWKTPoint(s.geom);
    if (!position && s.geom) {
      console.warn('[Map] Failed to parse geom:', s.geom, 'for sighting:', s.id);
    }
    return position !== null;
  });

  console.log('[Map] Total sightings:', sightings.length, 'With location:', sightingsWithLocation.length);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => fetchNearbySightings(mapCenter.lat, mapCenter.lng, mapZoom)}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <MapIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">목격 지도</h1>
      </div>

      {/* 통계 정보 및 재검색 버튼 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-sm">
              <span className="text-gray-600">지도에 표시:</span>{' '}
              <span className="font-semibold text-blue-800">{sightingsWithLocation.length}건</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">검색 반경:</span>{' '}
              <span className="font-semibold text-blue-800">{formatRadius(getRadiusFromZoom(mapZoom))}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">중심 좌표:</span>{' '}
              <span className="font-mono text-xs text-blue-800">
                {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* 재검색 버튼 */}
          <Button
            onClick={handleRefreshSearch}
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                검색 중...
              </>
            ) : (
              <>
                <SearchIcon className="w-4 h-4" />
                현재 위치에서 재검색
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 지도 - 목격 정보가 없어도 항상 표시 */}
      <div className="space-y-4">
        <SightingMap
          sightings={sightingsWithLocation}
          center={mapCenter}
          zoom={mapZoom}
          height="600px"
          onMarkerClick={handleMarkerClick}
          onMapMove={handleMapMove}
        />

        {/* 위치 정보가 없을 때 안내 메시지 */}
        {sightingsWithLocation.length === 0 && !isLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 text-sm">
              현재 위치(반경 {formatRadius(getRadiusFromZoom(mapZoom))})에 목격 정보가 없습니다.
              지도를 이동하거나 축소해보세요.
            </p>
          </div>
        )}
      </div>

      {/* 선택된 목격 정보 상세 */}
      {selectedSighting && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedSighting.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSighting(null)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이미지 */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedSighting.sanitizedUrl}
                alt={selectedSighting.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 정보 */}
            <div className="space-y-3">
              {selectedSighting.commonNameKo && (
                <div>
                  <span className="text-sm text-gray-600">동물 이름:</span>
                  <p className="font-medium">{selectedSighting.commonNameKo}</p>
                </div>
              )}

              {selectedSighting.scientificName && (
                <div>
                  <span className="text-sm text-gray-600">학명:</span>
                  <p className="font-medium italic">{selectedSighting.scientificName}</p>
                </div>
              )}

              {selectedSighting.aiConfidence && (
                <div>
                  <span className="text-sm text-gray-600">AI 신뢰도:</span>
                  <p className="font-medium">
                    {Math.round(selectedSighting.aiConfidence * 100)}%
                  </p>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-600">제보자:</span>
                <p className="font-medium">{selectedSighting.displayName}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">등록일:</span>
                <p className="font-medium">
                  {new Date(selectedSighting.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => {
                  window.location.href = `/sightings/${selectedSighting.id}`;
                }}
              >
                상세 보기 →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
