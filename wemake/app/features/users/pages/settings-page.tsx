import { useState } from 'react';
import { type MetaFunction, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMyProfile } from '../hooks/use-my-profile';
import { useAuth } from '~/lib/hooks/use-auth.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Label } from '~/common/components/ui/label';

export const meta: MetaFunction = () => {
  return [{ title: '설정 | 셔터 히어로즈' }];
};

const updateProfileSchema = z.object({
  displayName: z.string().min(1, '표시 이름을 입력해주세요').optional(),
  avatarUrl: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { isUpdating, error, updateProfile } = useMyProfile();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setSuccessMessage('');
    try {
      await updateProfile({
        displayName: data.displayName,
        avatarUrl: data.avatarUrl || undefined,
      });
      setSuccessMessage('프로필이 성공적으로 수정되었습니다');
    } catch (err) {
      // Error handled in useMyProfile
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

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
      <h1 className="text-3xl font-bold">설정</h1>

      <Card>
        <CardHeader>
          <CardTitle>프로필 정보</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 (변경 불가)</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">표시 이름</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="표시 이름을 입력하세요"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">프로필 이미지 URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatarUrl')}
              />
              {errors.avatarUrl && (
                <p className="text-sm text-red-600">{errors.avatarUrl.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? '저장 중...' : '프로필 수정'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>계정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">계정에서 로그아웃합니다</p>
            <Button onClick={handleLogout} variant="destructive">
              로그아웃
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
