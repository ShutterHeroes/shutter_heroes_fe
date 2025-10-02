import { Hero } from "~/common/components/hero";
import { PictureCard } from "../components/picture-card";
import PicturePagination from "~/common/components/picture-pagination";
import type { Route } from "./+types/category-page";

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    { title: `Developer Tools | Shutter Heroes` },
    { name: "description", content: `Browse Developer Tools pictures` },
  ];
};

export default function CategoryPage() {
  return (
    <div className="space-y-10">
      <Hero
        title={"Developer Tools"}
        subtitle={`Tools for developers to build pictures faster`}
      />

      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {Array.from({ length: 11 }).map((_, index) => (
          <PictureCard
            key={`pictureId-${index}`}
            id={`pictureId-${index}`}
            name="Picture Name"
            description="Picture Description"
            commentsCount={12}
            viewsCount={12}
            votesCount={120}
          />
        ))}
      </div>
        <PicturePagination totalPages={10} />
    </div>
  );
}