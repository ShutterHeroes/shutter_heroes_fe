import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "메시지 | 셔터 히어로즈" }];
};

export default function MessagePage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-6 font-brush">메시지</h1>
      <div className="grid gap-6">{/* 메시지 내용이 여기에 표시됩니다 */}</div>
    </div>
  );
}