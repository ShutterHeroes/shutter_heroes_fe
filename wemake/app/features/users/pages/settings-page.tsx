import { Form } from "react-router";
import type { Route } from "./+types/settings-page";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { useState } from "react";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [{ title: "설정 | 셔터 히어로즈" }];
};

export default function SettingsPage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-40">
        <div className="col-span-4 flex flex-col gap-10">
          <h2 className="text-2xl font-semibold font-brush">프로필 편집</h2>
          <Form className="flex flex-col w-1/2 gap-5">
            <InputPair
              label="이름"
              description="공개 이름"
              required
              id="name"
              name="name"
              placeholder="홍길동"
            />
            <SelectPair
              label="역할"
              description="가장 많이 동일시하는 역할은 무엇인가요"
              name="role"
              placeholder="역할 선택"
              options={[
                { label: "개발자", value: "developer" },
                { label: "디자이너", value: "designer" },
                { label: "제품 관리자", value: "product-manager" },
                { label: "창업자", value: "founder" },
                { label: "기타", value: "other" },
              ]}
            />
            <InputPair
              label="헤드라인"
              description="프로필에 대한 소개입니다."
              required
              id="headline"
              name="headline"
              placeholder="홍길동"
              textArea
            />
            <InputPair
              label="소개"
              description="공개 소개입니다. 프로필 페이지에 표시됩니다."
              required
              id="bio"
              name="bio"
              placeholder="홍길동"
              textArea
            />
            <Button className="w-full">프로필 업데이트</Button>
          </Form>
        </div>
        <aside className="col-span-2 p-6 rounded-lg border shadow-md">
          <Label className="flex flex-col gap-1">
            아바타
            <small className="text-muted-foreground">
              공개 아바타입니다.
            </small>
          </Label>
          <div className="space-y-5">
            <div className="size-40 rounded-full shadow-xl overflow-hidden ">
              {avatar ? (
                <img src={avatar} className="object-cover w-full h-full" />
              ) : null}
            </div>
            <Input
              type="file"
              className="w-1/2"
              onChange={onChange}
              required
              name="icon"
            />
            <div className="flex flex-col text-xs">
              <span className=" text-muted-foreground">
                권장 크기: 128x128px
              </span>
              <span className=" text-muted-foreground">
                허용 형식: PNG, JPEG
              </span>
              <span className=" text-muted-foreground">최대 파일 크기: 1MB</span>
            </div>
            <Button className="w-full">아바타 업데이트</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}