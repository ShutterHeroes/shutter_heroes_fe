import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import type { Route } from "./+types/message-page";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Form } from "react-router";
import { Textarea } from "~/common/components/ui/textarea";
import { Button } from "~/common/components/ui/button";
import { SendIcon } from "lucide-react";
import { MessageBubble } from "../components/message-bubble";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Message | Shutter Heroes" }];
};

export default function MessagePage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed height */}
      <Card className="flex-shrink-0">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src="/logo.png" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <CardTitle className="text-xl">야생의 GPT</CardTitle>
          </div>
        </CardHeader>
      </Card>
      
      {/* Messages area - flexible height with proper overflow */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <MessageBubble
            key={index}
            avatarUrl="/logo.png"
            avatarFallback="S"
            content="야생에 대한 모든 것 Shutter Heroes."
            isCurrentUser={index % 2 === 0}
          />
        ))}
      </div>
      
      {/* Input area - fixed height */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <Form className="relative flex justify-end items-center">
            <Textarea
              placeholder="Write a message..."
              rows={2}
              className="resize-none"
            />
            <Button type="submit" size="icon" className="absolute right-2">
              <SendIcon className="size-4" />
            </Button>
          </Form>
        </CardHeader>
      </Card>
    </div>
  );
}