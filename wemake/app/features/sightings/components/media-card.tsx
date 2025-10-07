import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '~/common/components/ui/card';
import { Badge } from '~/common/components/ui/badge';
import type { Media } from '~/lib/types/media.types';
import { CalendarIcon, EyeIcon, EyeOffIcon, ImageOffIcon } from 'lucide-react';

interface MediaCardProps {
  media: Media;
}

export function MediaCard({ media }: MediaCardProps) {
  const [imageError, setImageError] = useState(false);
  // storagePath에 이미 S3 URL이 포함되어 있음
  const imageUrl = media.storagePath;
  const createdDate = new Date(media.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/sightings/${media.sightingId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400">
              <ImageOffIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">이미지 없음</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="동물 목격"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={media.sightingVisibility === 'public' ? 'default' : 'secondary'}>
              {media.sightingVisibility === 'public' ? (
                <><EyeIcon className="w-3 h-3 mr-1" /> 공개</>
              ) : (
                <><EyeOffIcon className="w-3 h-3 mr-1" /> 비공개</>
              )}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{createdDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
