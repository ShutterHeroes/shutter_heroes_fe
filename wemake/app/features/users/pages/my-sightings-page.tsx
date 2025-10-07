import { useEffect, useState, useRef, useCallback } from 'react';
import { type MetaFunction, Link } from 'react-router';
import { Button } from '~/common/components/ui/button';
import { useAuth } from '~/lib/hooks/use-auth';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { SightingListCard } from '~/features/sightings/components/sighting-list-card';
import { Loader2 } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{ title: '내 목격 정보 | 셔터 히어로즈' }];
};

export default function MySightingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [sightings, setSightings] = useState<SightingListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadSightings = useCallback(async (page: number) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await sightingsApi.getMySightings({
        page,
        size: 20,
      });

      if (page === 0) {
        setSightings(response.content);
      } else {
        setSightings((prev) => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('내 목격 정보 조회 실패:', err);
      setError(err.response?.data?.message || '목격 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (user && !authLoading) {
      loadSightings(0);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadSightings(currentPage + 1);
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
  }, [hasMore, isLoading, currentPage, loadSightings]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-gray-500">로그인이 필요합니다</p>
          <Button asChild>
            <Link to="/auth/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error && sightings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-20 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">내 목격 정보</h1>
      </div>

      {sightings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sightings.map((sighting) => (
              <SightingListCard key={sighting.id} sighting={sighting} />
            ))}
          </div>

          {hasMore && (
            <div ref={loadMoreRef} className="flex items-center justify-center py-8">
              {isLoading && (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500 mr-2" />
                  <span className="text-gray-600">로딩 중...</span>
                </>
              )}
            </div>
          )}

          {!hasMore && sightings.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">모든 목격 정보를 불러왔습니다.</p>
            </div>
          )}
        </>
      ) : !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 등록한 목격 정보가 없습니다.</p>
          <Button asChild className="mt-4">
            <Link to="/sightings/submit">목격 정보 등록하기</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
