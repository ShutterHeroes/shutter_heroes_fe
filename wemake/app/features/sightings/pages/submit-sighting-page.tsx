import { useState, useEffect } from 'react';
import { type MetaFunction, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '~/features/ai/components/image-upload';
import { sightingsApi } from '~/lib/api/sightings.api';
import { aiApi } from '~/lib/api/ai.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Label } from '~/common/components/ui/label';
import { Textarea } from '~/common/components/ui/textarea';
import { Badge } from '~/common/components/ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import type { AnimalDetection } from '~/lib/types/ai.types';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '목격 정보 등록 | 셔터 히어로즈' }];
};

const submitSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').optional(),
  description: z.string().optional(),
});

type SubmitFormData = z.infer<typeof submitSchema>;

export default function SubmitSightingPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [detections, setDetections] = useState<AnimalDetection[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
    }
  }, [isLoading, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
  });

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setError(null);
    setDetections([]);
    setIsSubmitting(true);

    try {
      // 이미지 업로드와 동시에 Sighting 생성 (백엔드에서 Vision API 처리)
      const sightingResult = await sightingsApi.create({
        image: file,
      });

      // 백엔드 응답에서 AI 인식 결과 저장
      setDetections(sightingResult.detections || []);

      // 생성된 목격 정보 페이지로 이동
      navigate(`/sightings/${sightingResult.sightingId}`);
    } catch (err: any) {
      console.error('목격 정보 등록 에러:', err);
      setError(err.response?.data?.message || '목격 정보 등록에 실패했습니다');
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setDetections([]);
    setError(null);
  };

  const onSubmit = async (data: SubmitFormData) => {
    if (!selectedImage) {
      setError('이미지를 선택해주세요');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await sightingsApi.create({
        image: selectedImage,
        title: data.title,
        description: data.description,
      });

      // 생성 성공 시 상세 페이지로 이동
      navigate(`/sightings/${response.sightingId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '목격 정보 등록에 실패했습니다');
      console.error('목격 정보 등록 에러:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">동물 목격 정보 등록</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 이미지 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle>사진 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
            />
          </CardContent>
        </Card>

        {/* AI 인식 결과 */}
        {selectedImage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI 동물 인식 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRecognizing ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>동물을 인식하는 중...</span>
                </div>
              ) : detections.length > 0 ? (
                <div className="space-y-2">
                  {detections.map((detection, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {detection.commonName || detection.scientificName} (
                      {Math.round(detection.confidence * 100)}%)
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">탐지된 동물이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 제목 및 설명 */}
        <Card>
          <CardHeader>
            <CardTitle>상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 (선택)</Label>
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
            onClick={() => navigate('/sightings')}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedImage}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                등록 중...
              </>
            ) : (
              '등록하기'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
