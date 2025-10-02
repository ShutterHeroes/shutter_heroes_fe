import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";

interface MessageBubbleProps {
  avatarUrl: string;
  avatarFallback: string;
  content: string;
  isCurrentUser?: boolean;
}

export function MessageBubble({
  avatarUrl,
  avatarFallback,
  content,
  isCurrentUser = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-4 mb-4",
        isCurrentUser ? "flex-row-reverse" : ""
      )}
    >
      <Avatar className="flex-shrink-0">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-md p-4 text-sm max-w-[70%] min-w-0",
          isCurrentUser ? "bg-accent rounded-br-none" : "bg-primary text-primary-foreground rounded-bl-none"
        )}
      >
        <p className="break-words">{content}</p>
      </div>
    </div>
  );
}