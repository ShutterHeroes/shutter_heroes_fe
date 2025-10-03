import { useState, useEffect } from 'react';
import { type MetaFunction, useParams, useNavigate, Link } from 'react-router';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingDetail } from '~/lib/types/sighting.types';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Button } from '~/common/components/ui/button';
import { Badge } from '~/common/components/ui/badge';
import { Separator } from '~/common/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/common/components/ui/dialog';
import {
  Loader2,
  MapPin,
  Calendar,
  User,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  Pencil,
  Trash2,
  ImageOff,
} from 'lucide-react';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '목격 정보 상세 | 셔터 히어로즈' }];
};

export default function SightingDetailPage() {
  const { sightingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sighting, setSighting] = useState<SightingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!sightingId) {
      setError('잘못된 접근입니다.');
      setIsLoading(false);
      return;
    }

    const fetchSighting = async () => {
      try {
        const data = await sightingsApi.getById(sightingId);
        setSighting(data);
      } catch (err: any) {
        console.error('Sighting 조회 에러:', err);
        setError(err.response?.data?.message || '목격 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSighting();
  }, [sightingId]);

  const handleDelete = async () => {
    if (!sightingId) return;

    setIsDeleting(true);
    try {
      await sightingsApi.delete(sightingId);
      navigate('/my/sightings');
    } catch (err: any) {
      console.error('Sighting 삭제 에러:', err);
      setError(err.response?.data?.message || '목격 정보 삭제에 실패했습니다.');
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user && sighting && sighting.owner && user.userId === sighting.owner.userId;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error || !sighting) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || '목격 정보를 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate('/sightings')}>목록으로 돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/medias/${sighting.media.mediaId}/download`;

  return (
    <>
      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>목격 정보 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 목격 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-4xl py-8 space-y-6">
      {/* 뒤로 가기 버튼 */}
      <Button variant="ghost" onClick={() => navigate('/sightings')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로
      </Button>

      {/* 제목 및 상태 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{sighting.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(sighting.createdAt).toLocaleString('ko-KR')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sighting.visibility === 'public' ? (
            <Badge variant="secondary">
              <Eye className="w-3 h-3 mr-1" />
              공개
            </Badge>
          ) : (
            <Badge variant="outline">
              <EyeOff className="w-3 h-3 mr-1" />
              비공개
            </Badge>
          )}
          {sighting.speciesProcessingStatus === 'PENDING' && (
            <Badge variant="default">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              처리 중
            </Badge>
          )}
        </div>
      </div>

      {/* 이미지 */}
      <Card>
        <CardContent className="p-0">
          {imageError || !sighting.media ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
              <ImageOff className="w-20 h-20 text-gray-400 mb-4" />
              <p className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</p>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={sighting.title}
              className="w-full h-auto max-h-[600px] object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          )}
        </CardContent>
      </Card>

      {/* AI 인식 결과 */}
      {sighting.detections && sighting.detections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI 동물 인식 결과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sighting.detections.map((detection, index) => (
              <div key={detection.detectionId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {detection.commonName || detection.scientificName}
                  </p>
                  {detection.commonName && detection.scientificName && (
                    <p className="text-sm text-gray-500 italic">{detection.scientificName}</p>
                  )}
                </div>
                <Badge variant="secondary">
                  {Math.round(detection.confidence * 100)}% 확신
                </Badge>
              </div>
            ))}
            {sighting.aiConfidence && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500">
                  평균 신뢰도: {Math.round(sighting.aiConfidence * 100)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 설명 */}
      {sighting.description && (
        <Card>
          <CardHeader>
            <CardTitle>설명</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{sighting.description}</p>
          </CardContent>
        </Card>
      )}

      {/* 위치 정보 */}
      {sighting.gpsLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              위치 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              위도: {sighting.gpsLocation.latitude}, 경도: {sighting.gpsLocation.longitude}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 작성자 정보 */}
      {sighting.owner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              작성자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              to={`/users/${sighting.owner.userId}`}
              className="text-blue-600 hover:underline"
            >
              {sighting.owner.nickname} (@{sighting.owner.username})
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 수정/삭제 버튼 (본인만 가능) */}
      {isOwner ? (
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/sightings')}>
            목록으로
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/sightings/${sightingId}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            수정하기
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제하기
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/sightings')}>
            목록으로
          </Button>
        </div>
      )}
    </div>
    </>
  );
}
