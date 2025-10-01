import type { Route } from "./+types/profile-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Profile | Shutter Heroes" }];
};

export default function ProfilePage() {
  return (
    <div className="max-w-screen-md flex flex-col space-y-10">
      <div className="space-y-2">
        <h4 className="text-lg font-bold">자기소개</h4>
        <p className="text-muted-foreground">
         저는 야생동물 전문 사진작가입니다.
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-bold"></h4>
        <p className="text-muted-foreground">
        </p>
      </div>
    </div>
  );
}