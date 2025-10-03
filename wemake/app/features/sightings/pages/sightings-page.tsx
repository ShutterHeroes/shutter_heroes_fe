import { useEffect, useState } from 'react';
import { type MetaFunction } from 'react-router';
import { useAllSightings } from '../hooks/use-all-sightings';
import { SightingListCard } from '../components/sighting-list-card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { SearchIcon, Loader2Icon, XIcon } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{ title: '동물 목격 정보 | 셔터 히어로즈' }];
};

export default function SightingsPage() {
  const { sightings, isLoading, error, fetchSightings } = useAllSightings();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchSightings({ page: currentPage, size: 20, keyword: keyword || undefined });
  }, [currentPage, keyword, fetchSightings]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setKeyword('');
    setCurrentPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
          <Button onClick={() => fetchSightings({ page: 0, size: 20 })}>
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
        <h1 className="text-3xl font-bold">동물 목격 정보</h1>

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

      {/* 검색 결과 표시 */}
      {keyword && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            "<span className="font-semibold">{keyword}</span>" 검색 결과: {sightings?.totalElements || 0}건
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearSearch}>
            검색 초기화
          </Button>
        </div>
      )}

      {/* Sighting 목록 */}
      {sightings && sightings.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sightings.content.map((sighting) => (
              <SightingListCard key={sighting.id} sighting={sighting} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {sightings.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={sightings.first || isLoading}
                variant="outline"
              >
                이전
              </Button>
              <div className="flex items-center gap-1 px-4">
                <span className="text-sm font-medium">{currentPage + 1}</span>
                <span className="text-sm text-gray-500">/ {sightings.totalPages}</span>
              </div>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={sightings.last || isLoading}
                variant="outline"
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {keyword ? '검색 결과가 없습니다.' : '등록된 목격 정보가 없습니다.'}
          </p>
          {keyword && (
            <Button variant="outline" onClick={handleClearSearch} className="mt-4">
              전체 목록 보기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
