import { Hero } from "~/common/components/hero";
import { Form, type MetaFunction } from "react-router";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import SelectPair from "~/common/components/select-pair";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Submit Picture | Shutter Heroes" },
    { name: "description", content: "Submit your picture" },
  ];
};

export default function SubmitPage({ actionData }: { actionData?: any }) {
  const [picture, setPicture] = useState<string | null>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setPicture(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Hero
        title="Submit Your Picture"
        subtitle="Share your picture with the world"
      />
      <div className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto">
        <Form className="space-y-5">
          <InputPair
            label="Name"
            description="The title of your picture"
            id="name"
            name="name"
            type="text"
            required
            placeholder="Name of your picture"
          />
          <InputPair
            label="Tagline"
            description="A short, catchy description"
            id="tagline"
            name="tagline"
            required
            type="text"
            placeholder="A concise description of your picture"
          />

          <InputPair
            textArea
            label="Description"
            description="Detailed information about your picture"
            id="description"
            name="description"
            required
            type="text"
            placeholder="A detailed description of your picture"
          />
          <SelectPair
            label="Category"
            description="Choose the most appropriate category"
            name="category"
            required
            placeholder="Select a category"
            options={[
              { label: "AI", value: "ai" },
              { label: "Design", value: "design" },
              { label: "Marketing", value: "marketing" },
              { label: "Development", value: "development" },
            ]}
          />
          <Button className="w-full">Submit Picture</Button>
        </Form>
        <aside className="p-6 rounded-lg border shadow-md">
          <Label className="flex flex-col gap-1">
            Picture
            <small className="text-muted-foreground">
              Upload your picture here.
            </small>
          </Label>
          <div className="space-y-5">
            <div className="size-40 rounded-lg shadow-xl overflow-hidden border-2 border-dashed border-gray-300">
              {picture ? (
                <img src={picture} className="object-cover w-full h-full" />
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
            <div className="flex flex-col text-xs">
              <span className="text-muted-foreground">
                Recommended size: 800x600px
              </span>
              <span className="text-muted-foreground">
                Allowed formats: PNG, JPEG
              </span>
              <span className="text-muted-foreground">Maximum file size: 5MB</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
