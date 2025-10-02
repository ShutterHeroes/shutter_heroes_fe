import type { Media } from '~/lib/types/media.types';
import { MediaCard } from './media-card';

interface MediaGridProps {
  medias: Media[];
}

export function MediaGrid({ medias }: MediaGridProps) {
  if (medias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">아직 등록된 목격 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {medias.map((media) => (
        <MediaCard key={media.mediaId} media={media} />
      ))}
    </div>
  );
}
