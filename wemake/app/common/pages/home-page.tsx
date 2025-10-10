import { useState, useEffect } from 'react';
import type { Route } from './+types/home-page';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { BlurFade } from '~/common/components/ui/blur-fade';
import { Card, CardContent } from '../components/ui/card';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { SightingListCard } from '~/features/sightings/components/sighting-list-card';
import { Upload, Sparkles, Users, TrendingUp, ArrowRight, Map } from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '셔터 히어로즈 - 동물 목격 정보 공유 플랫폼' },
    { name: 'description', content: 'AI 기반 동물 인식으로 야생동물 목격 정보를 공유하세요' },
  ];
};

export default function HomePage() {
  const [recentSightings, setRecentSightings] = useState<SightingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSightings = async () => {
      try {
        const response = await sightingsApi.getAll({ page: 0, size: 20 });
        setRecentSightings(response.content);
      } catch (err) {
        console.error('최근 목격 정보 조회 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSightings();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center space-y-8">
          <BlurFade delay={0.1} inView>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              야생동물 목격,
              <br />
              <span className="text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI가 함께합니다
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              사진 한 장으로 동물을 인식하고, 목격 정보를 공유하세요.
              <br />
              AI 기술로 더 쉽고 정확한 야생동물 관찰을 경험하세요.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/sightings/submit">
                  <Upload className="w-5 h-5 mr-2" />
                  목격 정보 등록하기
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/map">
                  <Map className="w-5 h-5 mr-2" />
                  지도에서 보기
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/sightings">
                  목격 정보 둘러보기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BlurFade delay={0.1} inView>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">AI 동물 인식</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  사진을 업로드하면 AI가 자동으로 동물을 인식하고 종을 분류합니다
                </p>
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 pt-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">커뮤니티 공유</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  다른 사용자들과 목격 정보를 공유하고 야생동물 관찰 경험을 나누세요
                </p>
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4 pt-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">데이터 축적</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  목격 정보가 쌓여 생태계 연구와 보존에 기여할 수 있습니다
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </section>

      {/* Recent Sightings Section */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">최근 목격 정보</h2>
            <Button asChild variant="ghost">
              <Link to="/sightings">
                전체 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentSightings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentSightings.map((sighting) => (
                  <SightingListCard key={sighting.id} sighting={sighting} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link to="/sightings">
                    더보기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                아직 등록된 목격 정보가 없습니다.
                <br />
                첫 번째 목격 정보를 등록해보세요!
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            야생동물을 발견하셨나요? 사진을 업로드하고 커뮤니티와 공유하세요.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/sightings/submit">
              <Upload className="w-5 h-5 mr-2" />
              지금 등록하기
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}