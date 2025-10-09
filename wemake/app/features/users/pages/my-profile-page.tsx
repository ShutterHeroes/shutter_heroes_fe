import { type MetaFunction } from 'react-router';
import { useAuth } from '~/lib/hooks/use-auth.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import {Avatar, AvatarImage} from '~/common/components/ui/avatar';
import { Badge } from '~/common/components/ui/badge';
import { Button } from '~/common/components/ui/button';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { sightingsApi } from '~/lib/api/sightings.api';
import { formatToKstDate, formatToKstDateTime } from '~/lib/utils/date.utils';

export const meta: MetaFunction = () => {
  return [{ title: '내 프로필 | 셔터 히어로즈' }];
};

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();
  const [sightingsCount, setSightingsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchSightingsCount = async () => {
      if (!user) return;

      try {
        const response = await sightingsApi.getMySightings({ page: 0, size: 1 });
        setSightingsCount(response.totalElements);
      } catch (error) {
        console.error('목격 정보 개수 조회 실패:', error);
      }
    };

    fetchSightingsCount();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-gray-500">로그인이 필요합니다</p>
          <Button asChild>
            <Link to="/auth/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">내 프로필</h1>
        <Button asChild variant="outline">
          <Link to="/my/settings">설정</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || "https://shutter-heroes-dev.s3.ap-northeast-2.amazonaws.com/images/logo/logo.png"} alt={user.displayName} />
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.displayName}</CardTitle>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">가입일</p>
            <p className="font-medium">
              {formatToKstDate(user.createdAt)}
            </p>
          </div>

          {user.lastLoginAt && (
            <div>
              <p className="text-sm text-gray-500">마지막 로그인</p>
              <p className="font-medium">
                {formatToKstDateTime(user.lastLoginAt)}
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">내 목격 정보</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold">
                {sightingsCount !== null ? `${sightingsCount}건` : '로딩 중...'}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/my/sightings">전체 보기</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
