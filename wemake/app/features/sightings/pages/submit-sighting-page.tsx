import { useState, useEffect } from 'react';
import { type MetaFunction, useNavigate } from 'react-router';
import { ImageUpload } from '~/features/ai/components/image-upload';
import { sightingsApi } from '~/lib/api/sightings.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/common/components/ui/dialog';
import { Button } from '~/common/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '관찰 정보 등록 | 셔터 히어로즈' }];
};

export default function SubmitSightingPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginDialog(true);
    }
  }, [isLoading, user]);

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth/login');
  };

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setError(null);
    setIsSubmitting(true);

    try {
      // 이미지 업로드와 동시에 Sighting 생성
      const sightingResult = await sightingsApi.create({
        image: file,
      });

      // 생성된 관찰 정보 페이지로 이동
      navigate(`/sightings/${sightingResult.sightingId}`);
    } catch (err: any) {
      console.error('출동 기록 등록 에러:', err);
      setError(err.response?.data?.message || '출동 기록 등록에 실패했습니다');
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* 로그인 필요 다이얼로그 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
            <DialogDescription>
              출동 기록을 등록하려면 로그인이 필요합니다.
              <br />
              로그인 페이지로 이동하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button onClick={handleLoginRedirect}>
              로그인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-4xl space-y-6 py-8">
        <h1 className="text-3xl font-bold">출동 기록 등록</h1>

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
              disabled={isSubmitting}
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">
                사진을 선택하면 자동으로 AI가 동물을 인식하고 출동 기록이 생성됩니다.
                <br />
                제목과 설명은 나중에 수정할 수 있습니다.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>안내:</strong> 업로드되는 사진은 AI 학습에 사용될 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {isSubmitting && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500 mr-2" />
            <span className="text-gray-600">출동 기록을 생성하는 중...</span>
          </div>
        )}
      </div>
    </>
  );
}
