import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import type { Route } from "./+types";

interface LoaderData {
  pictureId: string;
}

interface ActionData {
  errors?: {
    rating?: string;
    content?: string;
  };
}

export function loader({ params }: Route.LoaderArgs) {
  return {
    pictureId: params.pictureId,
  };
}

export function action({ request, params }: Route.ActionArgs) {
  // Handle form submission here
  return {};
}

export function meta({ params }: Route.MetaFunction) {
  return [
    { title: "Write a Review" },
    { name: "description", content: "Share your experience with this picture" },
  ];
}

export default function NewPictureReviewPage({
  loaderData,
  actionData,
}: Route.ComponentProps<LoaderData, ActionData>) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-brush">Write a Review</h1>
      <Form method="post" className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating
            <select
              name="rating"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </select>
          </label>
          {actionData?.errors?.rating && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.rating}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Review
            <Textarea
              name="content"
              rows={4}
              className="mt-1"
              placeholder="Write your review here..."
            />
          </label>
          {actionData?.errors?.content && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.content}
            </p>
          )}
        </div>

        <Button type="submit">Submit Review</Button>
      </Form>
    </div>
  );
}