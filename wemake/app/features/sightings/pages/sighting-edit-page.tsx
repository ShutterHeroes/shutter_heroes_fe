import { useState, useEffect } from 'react';
import { type MetaFunction, useParams, useNavigate } from 'react-router';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingDetail } from '~/lib/types/sighting.types';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Textarea } from '~/common/components/ui/textarea';
import { Label } from '~/common/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/common/components/ui/select';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '목격 정보 수정 | 셔터 히어로즈' }];
};

export default function SightingEditPage() {
  const { sightingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sighting, setSighting] = useState<SightingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [occurredAt, setOccurredAt] = useState('');

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

        // 폼 초기값 설정
        setTitle(data.title || '');
        setDescription(data.description || '');
        setVisibility(data.visibility as 'public' | 'private');

        // occurredAt을 datetime-local 형식으로 변환
        if (data.occurredAt) {
          const date = new Date(data.occurredAt);
          const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setOccurredAt(localDateTime);
        } else {
          // occurredAt이 없으면 현재 시간으로 설정
          const now = new Date();
          const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setOccurredAt(localDateTime);
        }

        // 권한 체크
        if (user && data.user && user.id !== data.user.id) {
          setError('수정 권한이 없습니다.');
        }
      } catch (err: any) {
        console.error('Sighting 조회 에러:', err);
        setError(err.response?.data?.message || '목격 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSighting();
  }, [sightingId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingId) return;

    setIsSaving(true);
    setError(null);

    try {
      await sightingsApi.update(sightingId, {
        title: title || undefined,
        description: description || undefined,
        visibility,
        occurredAt: occurredAt ? new Date(occurredAt).toISOString() : undefined,
      });

      navigate(`/sightings/${sightingId}`);
    } catch (err: any) {
      console.error('Sighting 수정 에러:', err);
      setError(err.response?.data?.message || '목격 정보 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 md:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error || !sighting) {
    return (
      <div className="container mx-auto max-w-2xl px-4 md:px-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || '목격 정보를 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate(`/sightings/${sightingId}`)}>
              상세 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 md:px-8 space-y-6">
      {/* 뒤로 가기 버튼 */}
      <Button variant="ghost" onClick={() => navigate(`/sightings/${sightingId}`)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        상세 페이지로
      </Button>

      {/* 제목 */}
      <div>
        <h1 className="text-3xl font-bold">목격 정보 수정</h1>
        <p className="text-gray-500 mt-2">목격 정보의 내용을 수정할 수 있습니다.</p>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                type="text"
                placeholder="목격 정보의 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="목격 정보에 대한 상세한 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 text-right">
                {description.length} / 2000
              </p>
            </div>

            {/* 공개 여부 */}
            <div className="space-y-2">
              <Label htmlFor="visibility">공개 설정</Label>
              <Select value={visibility} onValueChange={(value: 'public' | 'private') => setVisibility(value)}>
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">공개 - 모든 사용자에게 표시됩니다</SelectItem>
                  <SelectItem value="private">비공개 - 본인만 볼 수 있습니다</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 목격 일시 */}
            <div className="space-y-2">
              <Label htmlFor="occurredAt">목격 일시</Label>
              <Input
                id="occurredAt"
                type="datetime-local"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/sightings/${sightingId}`)}
                disabled={isSaving}
              >
                취소
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
