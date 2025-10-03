import { Link } from 'react-router';
import { Card, CardContent } from '~/common/components/ui/card';
import { Badge } from '~/common/components/ui/badge';
import type { SightingListItem } from '~/lib/types/sighting.types';
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  UserIcon,
} from 'lucide-react';

interface SightingListCardProps {
  sighting: SightingListItem;
}

export function SightingListCard({ sighting }: SightingListCardProps) {
  const imageUrl = `${import.meta.env.VITE_API_BASE_URL}${sighting.sanitizedUrl}`;
  const createdDate = new Date(sighting.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/sightings/${sighting.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={sighting.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* 상단 우측 배지들 */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {/* 공개 여부 */}
            <Badge variant={sighting.visibility === 'public' ? 'default' : 'secondary'}>
              {sighting.visibility === 'public' ? (
                <><EyeIcon className="w-3 h-3 mr-1" /> 공개</>
              ) : (
                <><EyeOffIcon className="w-3 h-3 mr-1" /> 비공개</>
              )}
            </Badge>

            {/* 검증 상태 */}
            {sighting.isVerified && (
              <Badge variant="default" className="bg-green-600">
                <ShieldCheckIcon className="w-3 h-3 mr-1" /> 검증됨
              </Badge>
            )}
          </div>

          {/* 상단 좌측 보존 상태 배지 */}
          {sighting.status === 'endangered' && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive">
                <AlertTriangleIcon className="w-3 h-3 mr-1" /> 멸종위기
              </Badge>
            </div>
          )}
          {sighting.status === 'natural_monument' && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-amber-600">
                천연기념물
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* 제목 */}
          <h3 className="font-semibold text-lg line-clamp-1">{sighting.title}</h3>

          {/* 동물 이름 */}
          {(sighting.commonNameKo || sighting.scientificName) && (
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                {sighting.commonNameKo && (
                  <span className="text-sm font-medium truncate">{sighting.commonNameKo}</span>
                )}
                {sighting.scientificName && (
                  <span className="text-xs text-gray-500 italic truncate">
                    {sighting.scientificName}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI 신뢰도 */}
          {sighting.aiConfidence !== null && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                AI 신뢰도: {Math.round(sighting.aiConfidence * 100)}%
              </Badge>
            </div>
          )}

          {/* 날짜 및 작성자 */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span className="text-xs">{createdDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span className="text-xs truncate">{sighting.displayName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
