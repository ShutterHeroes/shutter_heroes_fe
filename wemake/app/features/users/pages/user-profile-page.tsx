import { useParams, type MetaFunction } from 'react-router';
import { useUserProfile } from '../hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Avatar } from '~/common/components/ui/avatar';
import { Badge } from '~/common/components/ui/badge';

export const meta: MetaFunction = () => {
  return [{ title: '사용자 프로필 | 셔터 히어로즈' }];
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user, isLoading, error } = useUserProfile(userId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error || '사용자를 찾을 수 없습니다'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} />
              ) : (
                <div className="bg-gray-300 h-full w-full flex items-center justify-center text-gray-600 text-3xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.displayName}</CardTitle>
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
              {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* TODO: Phase 3에서 사용자의 목격 정보 목록 추가 */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">이 사용자의 목격 정보는 곧 추가될 예정입니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
