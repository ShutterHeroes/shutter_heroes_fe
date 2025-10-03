import { useState, useEffect } from 'react';
import { type MetaFunction, useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingDetail } from '~/lib/types/sighting.types';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Label } from '~/common/components/ui/label';
import { Textarea } from '~/common/components/ui/textarea';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '목격 정보 수정 | 셔터 히어로즈' }];
};

const editSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']),
});

type EditFormData = z.infer<typeof editSchema>;

export default function EditSightingPage() {
  const { sightingId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [sighting, setSighting] = useState<SightingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    if (!sightingId) {
      setError('잘못된 접근입니다.');
      setIsLoading(false);
      return;
    }

    const fetchSighting = async () => {
      try {
        const data = await sightingsApi.getById(sightingId);

        // 권한 체크: 본인의 sighting만 수정 가능
        if (user && data.owner.userId !== user.userId) {
          setError('수정 권한이 없습니다.');
          setIsLoading(false);
          return;
        }

        setSighting(data);
        reset({
          title: data.title,
          description: data.description || '',
          visibility: data.visibility,
        });
      } catch (err: any) {
        console.error('Sighting 조회 에러:', err);
        setError(err.response?.data?.message || '목격 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSighting();
    }
  }, [sightingId, user, authLoading, navigate, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!sightingId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await sightingsApi.update(sightingId, {
        title: data.title,
        description: data.description,
        visibility: data.visibility,
      });

      // 수정 성공 시 상세 페이지로 이동
      navigate(`/sightings/${sightingId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '목격 정보 수정에 실패했습니다.');
      console.error('목격 정보 수정 에러:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
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

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      {/* 뒤로 가기 버튼 */}
      <Button variant="ghost" onClick={() => navigate(`/sightings/${sightingId}`)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        상세 페이지로
      </Button>

      <h1 className="text-3xl font-bold">목격 정보 수정</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 제목 및 설명 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                type="text"
                placeholder="목격 정보 제목을 입력하세요"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택)</Label>
              <Textarea
                id="description"
                placeholder="목격 상황, 위치 등을 상세히 적어주세요"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">공개 여부</Label>
              <select
                id="visibility"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('visibility')}
              >
                <option value="public">공개</option>
                <option value="private">비공개</option>
              </select>
              {errors.visibility && (
                <p className="text-sm text-red-600">{errors.visibility.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/sightings/${sightingId}`)}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                수정 중...
              </>
            ) : (
              '수정하기'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
