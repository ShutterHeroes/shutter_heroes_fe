import { PictureCard } from "~/features/pictures/components/picture-card";
import type { Route } from "./+types/profile-pictures-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Pictures | Shutter Heroes" }];
};

export default function ProfilePicturesPage() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, index) => (
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
  );
}