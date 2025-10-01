import { redirect } from "react-router";

export function loader() {
  // find user using the cookies
  return redirect("/users/nico");
}