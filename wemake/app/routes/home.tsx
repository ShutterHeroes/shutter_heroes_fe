import type { MetaFunction } from "react-router";
import HomePage from "../common/pages/home-page";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | Shutter Heroes" },
    { name: "description", content: "Welcome to Shutter Heroes" },
  ];
}

export default function Home() {
  return <HomePage />;
}
