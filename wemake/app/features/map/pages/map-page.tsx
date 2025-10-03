'use client';

import { useEffect, useState, useCallback } from 'react';
import { type MetaFunction } from 'react-router';
import { SightingMap } from '../components/sighting-map';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/common/components/ui/dialog';
import { SearchIcon, Loader2Icon, XIcon, MapIcon, ImageOff } from 'lucide-react';
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
  // sessionStorage에서 저장된 상태 복원
  const getInitialMapState = () => {
    if (typeof window === 'undefined') return { center: DEFAULT_MAP_CENTER, zoom: 13, sightings: [] };

    const saved = sessionStorage.getItem('mapState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          center: parsed.center || DEFAULT_MAP_CENTER,
          zoom: parsed.zoom || 13,
          sightings: parsed.sightings || [],
        };
      } catch {
        return { center: DEFAULT_MAP_CENTER, zoom: 13, sightings: [] };
      }
    }
    return { center: DEFAULT_MAP_CENTER, zoom: 13, sightings: [] };
  };

  const initialState = getInitialMapState();

  const [sightings, setSightings] = useState<SightingListItem[]>(initialState.sightings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSighting, setSelectedSighting] = useState<SightingListItem | null>(null);
  const [mapCenter, setMapCenter] = useState(initialState.center);
  const [mapZoom, setMapZoom] = useState(initialState.zoom);
  const [totalCount, setTotalCount] = useState(0);
  const [imageError, setImageError] = useState(false);

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

      console.log('[Map] Nearby API response:', response.length, 'sightings loaded');

      // 응답이 배열로 오므로 직접 설정
      setSightings(response);
      setTotalCount(response.length);

      // sessionStorage에 sightings도 저장
      if (typeof window !== 'undefined') {
        const currentState = sessionStorage.getItem('mapState');
        const parsed = currentState ? JSON.parse(currentState) : {};
        sessionStorage.setItem('mapState', JSON.stringify({
          ...parsed,
          sightings: response,
        }));
      }
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

    // sessionStorage에 상태 저장
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mapState', JSON.stringify({ center, zoom }));
    }
  }, []);

  // 현재 위치에서 재검색 버튼 핸들러
  const handleRefreshSearch = () => {
    fetchNearbySightings(mapCenter.lat, mapCenter.lng, mapZoom);
  };

  const handleMarkerClick = (sighting: SightingListItem) => {
    setSelectedSighting(sighting);
    setImageError(false); // 새 모달 열 때 이미지 에러 상태 초기화
  };

  // 위치 정보가 있는 목격 정보만 필터링
  const sightingsWithLocation = sightings.filter((s) => {
    const position = parseWKTPoint(s.geom);
    return position !== null;
  });

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

      {/* 선택된 목격 정보 상세 - 모달 */}
      {selectedSighting && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedSighting(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedSighting.title}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* 이미지 */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {imageError || !selectedSighting.sanitizedUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <ImageOff className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</p>
                  </div>
                ) : (
                  <img
                    src={selectedSighting.sanitizedUrl}
                    alt={selectedSighting.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              {/* 정보 */}
              <div className="space-y-3">
                {/* 동물 정보 섹션 */}
                {selectedSighting.commonNameKo && (
                  <div className="pb-3 border-b">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-xl text-blue-700">{selectedSighting.commonNameKo}</p>
                        {selectedSighting.commonNameEn && (
                          <p className="text-sm text-gray-500">{selectedSighting.commonNameEn}</p>
                        )}
                      </div>
                      {selectedSighting.status && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          selectedSighting.status === 'endangered'
                            ? 'bg-red-100 text-red-700'
                            : selectedSighting.status === 'natural_monument'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedSighting.status === 'endangered' && '멸종위기종'}
                          {selectedSighting.status === 'natural_monument' && '천연기념물'}
                          {selectedSighting.status === 'general' && '일반'}
                        </span>
                      )}
                    </div>
                    {selectedSighting.scientificName && (
                      <p className="text-sm italic text-gray-600">{selectedSighting.scientificName}</p>
                    )}
                  </div>
                )}

                {/* AI 신뢰도 */}
                {selectedSighting.aiConfidence !== null && selectedSighting.aiConfidence !== undefined && (
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">AI 신뢰도</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${Math.round(selectedSighting.aiConfidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-900">
                        {Math.round(selectedSighting.aiConfidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* 검증 상태 */}
                {selectedSighting.isVerified && (
                  <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-semibold text-sm">✓ 전문가 검증 완료</span>
                  </div>
                )}

                {/* 공개/비공개 상태 */}
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {selectedSighting.visibility === 'public' ? '🌐 공개' : '🔒 비공개'}
                  </span>
                </div>

                {/* 제보자 */}
                <div>
                  <span className="text-xs text-gray-500">제보자</span>
                  <p className="font-medium text-gray-800">{selectedSighting.displayName}</p>
                </div>

                {/* 목격 일시 */}
                {selectedSighting.occurredAt && (
                  <div>
                    <span className="text-xs text-gray-500">목격 일시</span>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedSighting.occurredAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {/* 등록일 */}
                <div>
                  <span className="text-xs text-gray-500">등록일</span>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedSighting.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* 최종 수정일 */}
                {selectedSighting.updatedAt && selectedSighting.updatedAt !== selectedSighting.createdAt && (
                  <div>
                    <span className="text-xs text-gray-500">최종 수정</span>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedSighting.updatedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* 설명 */}
                {selectedSighting.description && (
                  <div className="pt-3 border-t">
                    <span className="text-xs text-gray-500 block mb-1">상세 설명</span>
                    <p className="text-sm text-gray-800 leading-relaxed">{selectedSighting.description}</p>
                  </div>
                )}

                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    window.location.href = `/sightings/${selectedSighting.id}`;
                  }}
                >
                  상세 페이지로 이동 →
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
