import type{ MetaFunction } from "react-router";
import { PictureCard } from "~/features/pictures/components/picture-card";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "홈 | 셔터 히어로즈" },
    { name: "description", content: "셔터 히어로즈에 오신 것을 환영합니다" },
  ];
};

export default function HomePage() {
  return (
    <div className="px-20 space-y-40">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            오늘의 사진
          </h2>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/pictures/leaderboards">모든 사진 둘러보기 &rarr;</Link>
          </Button>
        </div>
        {Array.from({ length: 11 }).map((_, index) => (
          <PictureCard
            id={`pictureId-${index}`}
            name="사진 이름"
            description="사진 설명"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
      </div>
    </div>
  );
}