import { z } from "zod";
import type { Route } from "./+types/search-page";
import { Hero } from "~/common/components/hero";
import { PictureCard } from "../components/picture-card";
import PicturePagination from "~/common/components/picture-pagination";
import { Form } from "react-router";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "사진 검색 | 셔터 히어로즈" },
    { name: "description", content: "사진 검색" },
  ];
};

const paramsSchema = z.object({
  query: z.string().optional().default(""),
  page: z.coerce.number().optional().default(1),
});

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const { success, data: parsedData } = paramsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw new Error("Invalid params");
  }
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero
        title="검색"
        subtitle="제목이나 설명으로 사진을 검색하세요"
      />
      <Form className="flex justify-center h-14 max-w-screen-sm items-center gap-2 mx-auto">
        <Input
          name="query"
          placeholder="사진 검색"
          className="text-lg"
        />
        <Button type="submit">검색</Button>
      </Form>
      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {Array.from({ length: 11 }).map((_, index) => (
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
      </div>
        <PicturePagination totalPages={10} />
    </div>
  );
}