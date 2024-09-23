import type { MetaFunction } from "@remix-run/node";
import SpooktoberFestLanding from "../components/spooktoberfest-landing";

export const meta: MetaFunction = () => {
  return [
    { title: `SpooktoberFest ${new Date().getFullYear()}` },
    { name: "description", content: "A Halloween movie marathon event" },
  ];
};

export default function Index() {
  return <SpooktoberFestLanding />;
}
