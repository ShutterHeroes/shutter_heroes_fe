import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Picture Overview | Shutter Heroes" },
    { name: "description", content: "View picture details and information" },
  ];
};

export default function PictureOverviewPage({
  params: { pictureId },
}: { params: { pictureId: string } }) {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h3 className="text-lg font-bold font-brush">이 사진은 무엇인가요?</h3>
        <p className="text-muted-foreground">
          이 사진에 대한 설명이 여기에 표시됩니다.
        </p>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold font-brush"></h3>
        <p className="text-muted-foreground">
        </p>
      </div>
    </div>
  );
}