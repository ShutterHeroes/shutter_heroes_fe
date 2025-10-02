import { useEffect, useState } from 'react';
import { Link, type MetaFunction } from 'react-router';
import { useUsers } from '../hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Avatar } from '~/common/components/ui/avatar';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';

export const meta: MetaFunction = () => {
  return [{ title: '사용자 목록 | 셔터 히어로즈' }];
};

export default function UsersPage() {
  const { users, isLoading, error, fetchUsers } = useUsers();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchUsers(currentPage, 20, search);
  }, [currentPage, fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers(0, 20, search);
  };

  if (isLoading && !users) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">사용자 목록</h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="이메일 또는 이름으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">검색</Button>
      </form>

      {users && users.users.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.users.map((user) => (
              <Link key={user.id} to={`/users/${user.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.displayName} />
                        ) : (
                          <div className="bg-gray-300 h-full w-full flex items-center justify-center text-gray-600">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle>{user.displayName}</CardTitle>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-400">
                      가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={!users.hasPrevious || isLoading}
              variant="outline"
            >
              이전
            </Button>
            <span className="text-sm text-gray-600">
              {currentPage + 1} / {users.totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!users.hasNext || isLoading}
              variant="outline"
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
