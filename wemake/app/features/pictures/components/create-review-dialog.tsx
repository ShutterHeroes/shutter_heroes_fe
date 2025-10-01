import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/common/components/ui/dialog";
import { Label } from "~/common/components/ui/label";

export default function CreateReviewDialog() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          이사진은 어떠신가요?
        </DialogTitle>
        <DialogDescription>
          여러분의 생각을 공유해 주세요
        </DialogDescription>
      </DialogHeader>
      <Form className="space-y-10">
        <div>
          <Label className="flex flex-col gap-1">
            별 몇점?
            <small className="text-muted-foreground">
            </small>
          </Label>
          <div className="flex gap-2 mt-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <StarIcon
                  className="size-5 text-yellow-400"
                  fill={
                    hoveredStar >= star || rating >= star
                      ? "currentColor"
                      : "none"
                  }
                />
                <input
                  type="radio"
                  value="star"
                  name="rating"
                  required
                  className="opacity-0 h-px w-px absolute"
                  onChange={() => setRating(star)}
                />
              </label>
            ))}
          </div>
        </div>
        <InputPair
          textArea
          required
          label="리뷰"
          description="최대 1000자"
          placeholder="여려분의 생각을 공유해 주세요"
        />
        <DialogFooter>
          <Button type="submit">리뷰 제출</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
}