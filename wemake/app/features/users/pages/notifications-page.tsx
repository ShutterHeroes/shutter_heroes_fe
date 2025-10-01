import type { Route } from "./+types/notifications-page";
import { NotificationCard } from "../components/notification-card";

export const meta: Route.MetaFunction = () => {
  return [{ title: "알림 | 셔터 히어로즈" }];
};

export default function NotificationsPage() {
  return (
    <div className="space-y-20">
      <h1 className="text-4xl font-bold">알림</h1>
      <div className="flex flex-col items-start gap-5">
        <NotificationCard
          avatarUrl="https://github.com/serranoarevalo.png"
          avatarFallback="S"
          userName="스티브 잡스"
          message="님이 팔로우했습니다."
          timestamp="2일 전"
          seen={false}
        />
      </div>
    </div>
  );
}