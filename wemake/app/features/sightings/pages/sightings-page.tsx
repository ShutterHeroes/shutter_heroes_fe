import { useEffect, useState } from 'react';
import { type MetaFunction } from 'react-router';
import { useMedias } from '../hooks/use-medias';
import { MediaGrid } from '../components/media-grid';
import { Button } from '~/common/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: '동물 목격 정보 | 셔터 히어로즈' }];
};

export default function SightingsPage() {
  const { medias, isLoading, error, fetchMedias } = useMedias();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMedias({ page: currentPage, size: 20 });
  }, [currentPage, fetchMedias]);

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
        <h1 className="text-3xl font-bold">동물 목격 정보</h1>
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
          <p className="text-gray-500">등록된 목격 정보가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
