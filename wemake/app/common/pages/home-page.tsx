import type { Route } from "./+types/home-page";
import { PictureCard } from "~/features/pictures/components/picture-card";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { BlurFade } from "~/common/components/ui/blur-fade";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "홈 | 셔터 히어로즈" },
    { name: "description", content: "셔터 히어로즈에 오신 것을 환영합니다" },
  ];
};

export function loader() {
  return null;
}

export function action() {
  return null;
}

export default function HomePage() {
  const images = [
    { src: "/p_1.jpeg", alt: "Colorful bird on branch" },
    { src: "/p_2.jpg", alt: "Bird silhouette on wire" },
    { src: "/p_3.jpeg", alt: "Sea turtle swimming" },
    { src: "/p_4.jpeg", alt: "Pink flowers close-up" },
    { src: "/p_5.jpeg", alt: "Small bird on pine branch" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section id="photos">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {images.map((image, idx) => (
            <BlurFade key={image.src} delay={0.25 + idx * 0.05} inView>
              <img
                className="mb-4 w-full rounded-lg object-cover hover:opacity-90 transition-opacity cursor-pointer"
                src={image.src}
                alt={image.alt}
                loading="lazy"
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}