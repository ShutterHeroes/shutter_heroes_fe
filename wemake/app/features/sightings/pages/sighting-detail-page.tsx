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
  Mail,
  MapPinned,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { parseWKTPoint } from '~/lib/utils/geo.utils';
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

  const isOwner = user && sighting && sighting.user && user.userId === sighting.user.id;

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

  // media.sanitizedUrl, url, storagePath 중 하나에 S3 URL이 포함되어 있음
  const imageUrl = sighting.media?.sanitizedUrl || sighting.media?.url || sighting.media?.storagePath || null;

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
          {imageError || !imageUrl ? (
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

      {/* 종 정보 (Species) */}
      {sighting.species && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              동물 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">한글명</span>
                <p className="font-bold text-xl text-blue-700">
                  {sighting.species.commonNameKo || '정보 없음'}
                </p>
              </div>
              {sighting.species.commonNameEn && (
                <div>
                  <span className="text-sm text-gray-600">영문명</span>
                  <p className="font-semibold text-lg text-gray-700">
                    {sighting.species.commonNameEn}
                  </p>
                </div>
              )}
            </div>

            <div>
              <span className="text-sm text-gray-600">학명</span>
              <p className="font-medium italic text-gray-800">
                {sighting.species.scientificName}
              </p>
            </div>

            {sighting.species.status && (
              <div>
                <span className="text-sm text-gray-600">보호 등급</span>
                <div className="mt-1">
                  <Badge
                    className={
                      sighting.species.status === 'endangered'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : sighting.species.status === 'natural_monument'
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {sighting.species.status === 'endangered' && '멸종위기종'}
                    {sighting.species.status === 'natural_monument' && '천연기념물'}
                    {sighting.species.status === 'general' && '일반종'}
                  </Badge>
                </div>
              </div>
            )}

            {sighting.aiConfidence !== null && (
              <div className="pt-3 border-t">
                <span className="text-sm text-gray-600 block mb-2">AI 신뢰도</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all rounded-full"
                      style={{ width: `${Math.round(sighting.aiConfidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-blue-700">
                    {Math.round(sighting.aiConfidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {sighting.isVerified && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">전문가 검증 완료</span>
                </div>
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
      {sighting.geom && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="w-5 h-5 text-red-600" />
              위치 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const position = parseWKTPoint(sighting.geom);
              return position ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">위도</span>
                      <p className="font-mono text-sm font-medium">{position.lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">경도</span>
                      <p className="font-mono text-sm font-medium">{position.lng.toFixed(6)}</p>
                    </div>
                  </div>
                  {sighting.addressText && (
                    <div className="pt-3 border-t">
                      <span className="text-sm text-gray-600 block mb-1">주소</span>
                      <p className="text-sm text-gray-800">{sighting.addressText}</p>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <a
                      href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                    >
                      <MapPin className="w-4 h-4" />
                      Google Maps에서 보기 →
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">위치 정보를 파싱할 수 없습니다</p>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* 목격 일시 */}
      {sighting.occurredAt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              목격 일시
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {new Date(sighting.occurredAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 작성자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            제보자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">이름</span>
            <p className="font-semibold text-lg">{sighting.user.displayName}</p>
          </div>
          {sighting.user.email && (
            <div>
              <span className="text-sm text-gray-600">이메일</span>
              <p className="text-sm flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                {sighting.user.email}
              </p>
            </div>
          )}
          <div className="pt-3 border-t">
            <Link
              to={`/users/${sighting.user.id}`}
              className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
            >
              프로필 보기 →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 등록 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            등록 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">등록일</span>
              <p className="text-sm font-medium">
                {new Date(sighting.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">최종 수정</span>
              <p className="text-sm font-medium">
                {new Date(sighting.updatedAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          {sighting.detectedBy && (
            <div className="pt-3 border-t">
              <span className="text-sm text-gray-600">감지 방법</span>
              <p className="text-sm font-medium text-gray-700">{sighting.detectedBy}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
