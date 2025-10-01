import { Hero } from "~/common/components/hero";
import { Form, type MetaFunction } from "react-router";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Submit Picture | Shutter Heroes" },
    { name: "description", content: "Submit your picture" },
  ];
};

export default function SubmitPicturePage({ actionData }: { actionData?: any }) {
  const [picture, setPicture] = useState<string | null>(null);
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPicture(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Hero
        title="사진을 올려주세요"
        subtitle=""
      />
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <Form 
          method="post" 
          encType="multipart/form-data"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Form Fields Section (Now Left) */}
          <div className="space-y-5">
            <InputPair
              label="동물"
              description=""
              id="name"
              name="name"
              type="text"
              required
              placeholder="어떤 동물인가요?"
            />
            <InputPair
              label="테그"
              description=""
              id="tagline"
              name="tagline"
              required
              type="text"
              placeholder="테그"
            />
                        <SelectPair
              label="발견장소"
              description="발견장소"
              name="location"
              required
              placeholder="Select a category"
              options={[
                { label: "Seoul", value: "서울" },
                { label: "Gyeonggi", value: "경기도" },
                { label: "Gangwon", value: "강원도" },
                { label: "Chungcheong", value: "충청도" },
                { label: "Jeolla", value: "전라도" },
                { label: "Gyeongsang", value: "경상도" },
                { label: "Jeju", value: "제주도" },
                { label: "Ulleungdo", value: "울릉도" },
              ]}
            />
            <InputPair
              textArea
              label="특이사항"
              description=""
              id="description"
              name="description"
              required
              type="text"
              placeholder="특이사항을 알려주세요"
            />
            <Button type="submit" className="w-full">
              사진 제출
            </Button>
          </div>
          
          {/* Picture Upload Section (Now Right) */}
          <aside className="p-6 rounded-lg border shadow-md">
            <Label className="flex flex-col gap-1">
              사진을 올려주세요
              <small className="text-muted-foreground">
              </small>
            </Label>
            <div className="space-y-5 mt-4">
              <div className="w-full aspect-[4/3] max-w-md rounded-lg shadow-xl overflow-hidden border-2 border-dashed border-gray-300">
                {picture ? (
                  <img 
                    src={picture} 
                    alt="Preview" 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span>No image selected</span>
                  </div>
                )}
              </div>
              <Input
                type="file"
                className="w-full"
                onChange={onChange}
                required
                name="picture"
                accept="image/png,image/jpeg"
              />
              <div className="flex flex-col text-xs space-y-1">
                <span className="text-muted-foreground">
                  Recommended size: 800x600px
                </span>
                <span className="text-muted-foreground">
                  Allowed formats: PNG, JPEG
                </span>
                <span className="text-muted-foreground">
                  Maximum file size: 5MB
                </span>
              </div>
            </div>
          </aside>
        </Form>
      </div>
    </div>
  );
}