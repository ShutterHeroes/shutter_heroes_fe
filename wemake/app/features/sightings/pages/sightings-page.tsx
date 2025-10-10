import { useEffect, useState, useRef, useCallback } from 'react';
import { type MetaFunction, useLocation } from 'react-router';
import { SightingListCard } from '../components/sighting-list-card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { SearchIcon, Loader2Icon, XIcon } from 'lucide-react';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingListItem } from '~/lib/types/sighting.types';

export const meta: MetaFunction = () => {
  return [{ title: '동물 관찰 정보 | 셔터 히어로즈' }];
};

export default function SightingsPage() {
  const location = useLocation();
  const [sightings, setSightings] = useState<SightingListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollPositionSaved = useRef(false);

  const loadSightings = useCallback(async (page: number, searchKeyword?: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await sightingsApi.getAll({
        page,
        size: 20,
        keyword: searchKeyword || undefined,
      });

      if (page === 0) {
        setSightings(response.content);
      } else {
        setSightings((prev) => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setCurrentPage(page);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      console.error('출동 기록 조회 실패:', err);
      setError(err.response?.data?.message || '출동 기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 초기 데이터 로드 및 상태 복원
  useEffect(() => {
    const savedState = sessionStorage.getItem('sightings-page-state');

    if (savedState) {
      try {
        const { sightings: savedSightings, currentPage: savedPage, keyword: savedKeyword, searchInput: savedSearchInput } = JSON.parse(savedState);

        // 저장된 상태 복원
        setSightings(savedSightings);
        setCurrentPage(savedPage);
        setKeyword(savedKeyword || '');
        setSearchInput(savedSearchInput || '');
        setHasMore(true); // 무한 스크롤은 계속 가능하도록

        sessionStorage.removeItem('sightings-page-state');
      } catch (err) {
        console.error('상태 복원 실패:', err);
        loadSightings(0, keyword || undefined);
      }
    } else {
      loadSightings(0, keyword || undefined);
    }
  }, []);

  // 스크롤 위치 복원
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('sightings-scroll-position');

    if (savedScrollPosition && !scrollPositionSaved.current && sightings.length > 0) {
      // 스크롤 위치 복원은 데이터 로딩 후에 수행
      const restoreScroll = () => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        scrollPositionSaved.current = true;
        sessionStorage.removeItem('sightings-scroll-position');
      };

      // 데이터가 로드될 때까지 약간 지연
      const timer = setTimeout(restoreScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [sightings]);

  // 컴포넌트 언마운트 시 스크롤 위치 및 상태 저장
  useEffect(() => {
    return () => {
      sessionStorage.setItem('sightings-scroll-position', window.scrollY.toString());
      sessionStorage.setItem('sightings-page-state', JSON.stringify({
        sightings,
        currentPage,
        keyword,
        searchInput,
      }));
    };
  }, [sightings, currentPage, keyword, searchInput]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadSightings(currentPage + 1, keyword || undefined);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, currentPage, keyword, loadSightings]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(0);
    setSightings([]);
    setHasMore(true);
    loadSightings(0, searchInput || undefined);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setKeyword('');
    setCurrentPage(0);
    setSightings([]);
    setHasMore(true);
    loadSightings(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (error && sightings.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-20">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadSightings(0)}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-20 space-y-6">
      {/* 헤더 및 검색 */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">출동 기록</h1>

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
            "<span className="font-semibold">{keyword}</span>" 검색 결과: {totalElements}건
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearSearch}>
            검색 초기화
          </Button>
        </div>
      )}

      {/* Sighting 목록 */}
      {sightings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sightings.map((sighting) => (
              <SightingListCard key={sighting.id} sighting={sighting} />
            ))}
          </div>

          {hasMore && (
            <div ref={loadMoreRef} className="flex items-center justify-center py-8">
              {isLoading && (
                <>
                  <Loader2Icon className="w-6 h-6 animate-spin text-gray-500 mr-2" />
                  <span className="text-gray-600">로딩 중...</span>
                </>
              )}
            </div>
          )}

          {!hasMore && sightings.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">모든 출동 기록을 불러왔습니다.</p>
            </div>
          )}
        </>
      ) : !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {keyword ? '검색 결과가 없습니다.' : '등록된 출동 기록이 없습니다.'}
          </p>
          {keyword && (
            <Button variant="outline" onClick={handleClearSearch} className="mt-4">
              전체 목록 보기
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
}
