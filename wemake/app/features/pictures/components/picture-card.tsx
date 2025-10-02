import { Link } from "react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { ChevronUpIcon, EyeIcon, MessageCircleIcon } from "lucide-react";

interface PictureCardProps {
  id: string;
  name: string;
  description: string;
  commentsCount: number;
  viewsCount: number;
  votesCount: number;
}

export function PictureCard({
  id,
  name,
  description,
  commentsCount,
  viewsCount,
  votesCount,
}: PictureCardProps) {
  return (
    <Link to={`/pictures/${id}`}>
      <Card className="w-full bg-transparent hover:bg-card/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                {name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-px text-xs text-muted-foreground">
                  <MessageCircleIcon className="w-4 h-4" />
                  <span>{commentsCount}</span>
                </div>
                <div className="flex items-center gap-px text-xs text-muted-foreground">
                  <EyeIcon className="w-4 h-4" />
                  <span>{viewsCount}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex flex-col h-14 shrink-0">
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{votesCount}</span>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}