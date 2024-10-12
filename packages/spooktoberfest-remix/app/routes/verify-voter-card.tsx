import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { verifyVoterCard } from "~/services/sign-voter-card";

const isProd = process.env.SPK_ENV === "prod";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams;
  const jwt = search.get("voter_card") as string;
  const voterCard = await verifyVoterCard(jwt);
  return redirect(`/vote?name=${voterCard.name}`, {
    headers: isProd
      ? {
        "Set-Cookie": `voter_card=${jwt}; Path=/; HttpOnly; Secure; SameSite`,
      }
      : {
        "Set-Cookie": `voter_card=${jwt}; Path=/; HttpOnly; SameSite`,
      },
  });
};
