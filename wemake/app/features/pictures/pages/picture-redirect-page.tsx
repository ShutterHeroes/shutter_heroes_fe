import { redirect, type LoaderFunctionArgs } from "react-router";

export const loader = ({ params }: LoaderFunctionArgs) => {
  return redirect(`/pictures/${params.pictureId}/overview`);
};
