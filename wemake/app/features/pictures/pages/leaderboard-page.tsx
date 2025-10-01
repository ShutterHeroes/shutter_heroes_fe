import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/leaderboard-page";
import { Button } from "~/common/components/ui/button";
import { PictureCard } from "../components/picture-card";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "리더보드 | 셔터 히어로즈" },
    { name: "description", content: "최고 사진 리더보드" },
  ];
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-20">
      <Hero
        title="리더보드"
        subtitle="셔터 히어로즈에서 가장 인기 있는 사진들"
      />
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight font-brush">
            일간 리더보드
          </h2>
          <p className="text-xl font-light text-foreground">
            셔터 히어로즈에서 일별로 가장 인기 있는 사진들입니다.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <PictureCard
            key={`pictureId-${index}`}
            id={`pictureId-${index}`}
            name="사진 이름"
            description="사진 설명"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/pictures/leaderboards/daily">
            모든 사진 둘러보기 &rarr;
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight font-brush">
            주간 리더보드
          </h2>
          <p className="text-xl font-light text-foreground">
            셔터 히어로즈에서 주별로 가장 인기 있는 사진들입니다.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <PictureCard
            key={`pictureId-${index}`}
            id={`pictureId-${index}`}
            name="사진 이름"
            description="사진 설명"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/pictures/leaderboards/weekly">
            모든 사진 둘러보기 &rarr;
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight font-brush">
            월간 리더보드
          </h2>
          <p className="text-xl font-light text-foreground">
            셔터 히어로즈에서 월별로 가장 인기 있는 사진들입니다.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <PictureCard
            key={`pictureId-${index}`}
            id={`pictureId-${index}`}
            name="사진 이름"
            description="사진 설명"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/pictures/leaderboards/monthly">
            모든 사진 둘러보기 &rarr;
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight font-brush">
            연간 리더보드
          </h2>
          <p className="text-xl font-light text-foreground">
            셔터 히어로즈에서 연별로 가장 인기 있는 사진들입니다.
          </p>
        </div>
        {Array.from({ length: 7 }).map((_, index) => (
          <PictureCard
            key={`pictureId-${index}`}
            id={`pictureId-${index}`}
            name="사진 이름"
            description="사진 설명"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/pictures/leaderboards/yearly">
            모든 사진 둘러보기 &rarr;
          </Link>
        </Button>
      </div>
    </div>
  );
}