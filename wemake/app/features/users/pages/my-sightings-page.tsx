import { useEffect, useState } from 'react';
import { type MetaFunction, Link } from 'react-router';
import { useMyMedias } from '~/features/sightings/hooks/use-my-medias';
import { MediaGrid } from '~/features/sightings/components/media-grid';
import { Button } from '~/common/components/ui/button';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '내 목격 정보 | 셔터 히어로즈' }];
};

export default function MySightingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { medias, isLoading, error, fetchMyMedias } = useMyMedias();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyMedias({ page: currentPage, size: 20 });
  }, [currentPage, fetchMyMedias]);

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

  if (isLoading && !medias) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">내 목격 정보</h1>
      </div>

      {medias && medias.content.length > 0 ? (
        <>
          <MediaGrid medias={medias.content} />

          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={medias.first || isLoading}
              variant="outline"
            >
              이전
            </Button>
            <span className="text-sm text-gray-600">
              {currentPage + 1} / {medias.totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={medias.last || isLoading}
              variant="outline"
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 등록한 목격 정보가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
