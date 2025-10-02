import { Hero } from "~/common/components/hero";
import { CategoryCard } from "../components/category-card";
import type { Route } from "./+types/categories-page";

export const meta: Route.MetaFunction = () => [
  { title: "카테고리 | 셔터 히어로즈" },
  { name: "description", content: "카테고리별로 사진 둘러보기" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-10">
      <Hero title="카테고리" subtitle="카테고리별로 사진 둘러보기" />
      <div className="grid grid-cols-4 gap-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <CategoryCard
            key={`categoryId-${index}`}
            id={`categoryId-${index}`}
            name="카테고리 이름"
            description="카테고리 설명"
          />
        ))}
      </div>
    </div>
  );
}