'use client';

import { useEffect, useState } from 'react';
import { type MetaFunction } from 'react-router';
import { useAllSightings } from '~/features/sightings/hooks/use-all-sightings';
import { SightingMap } from '../components/sighting-map';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { SearchIcon, Loader2Icon, XIcon, MapIcon } from 'lucide-react';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { parseWKTPoint } from '~/lib/utils/geo.utils';

export const meta: MetaFunction = () => {
  return [{ title: '목격 지도 | 셔터 히어로즈' }];
};

export default function MapPage() {
  const { sightings, isLoading, error, fetchSightings } = useAllSightings();
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSighting, setSelectedSighting] = useState<SightingListItem | null>(null);

  // 초기 데이터 로드 (위치 정보가 있는 모든 목격 정보)
  useEffect(() => {
    fetchSightings({ page: 0, size: 1000 }); // 지도에 모든 마커 표시
  }, [fetchSightings]);

  const handleSearch = () => {
    setKeyword(searchInput);
    fetchSightings({ page: 0, size: 1000, keyword: searchInput || undefined });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setKeyword('');
    fetchSightings({ page: 0, size: 1000 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMarkerClick = (sighting: SightingListItem) => {
    setSelectedSighting(sighting);
  };

  // 위치 정보가 있는 목격 정보만 필터링
  const sightingsWithLocation = sightings?.content.filter((s) => {
    const position = parseWKTPoint(s.geom);
    return position !== null;
  }) || [];

  if (isLoading && !sightings) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => fetchSightings({ page: 0, size: 1000 })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 헤더 및 검색 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">목격 지도</h1>
        </div>

        {/* 검색 바 */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="동물 이름으로 검색... (예: 붉은여우, Vulpes vulpes)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            <SearchIcon className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <span className="text-gray-600">전체 목격 정보:</span>{' '}
            <span className="font-semibold text-blue-800">{sightings?.totalElements || 0}건</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">지도에 표시:</span>{' '}
            <span className="font-semibold text-blue-800">{sightingsWithLocation.length}건</span>
          </div>
          {keyword && (
            <div className="text-sm">
              <span className="text-gray-600">검색 결과:</span>{' '}
              <span className="font-semibold text-blue-800">"{keyword}"</span>
            </div>
          )}
        </div>
        {keyword && (
          <Button variant="ghost" size="sm" onClick={handleClearSearch}>
            검색 초기화
          </Button>
        )}
      </div>

      {/* 지도 - 목격 정보가 없어도 항상 표시 */}
      <div className="space-y-4">
        <SightingMap
          sightings={sightingsWithLocation}
          height="600px"
          onMarkerClick={handleMarkerClick}
        />

        {/* 위치 정보가 없을 때 안내 메시지 */}
        {sightingsWithLocation.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 text-sm">
              {keyword
                ? '검색된 목격 정보 중 위치 정보가 있는 항목이 없습니다.'
                : '지도에 표시할 위치 정보가 없습니다. 기본 위치(서울)를 표시합니다.'}
            </p>
            {keyword && (
              <Button variant="outline" size="sm" onClick={handleClearSearch} className="mt-2">
                전체 목록 보기
              </Button>
            )}
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
