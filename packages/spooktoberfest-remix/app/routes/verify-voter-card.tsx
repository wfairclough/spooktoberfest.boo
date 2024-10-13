import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { voterCardCookie } from "~/services/cookie.server";
import { verifyVoterCard } from "~/services/sign-voter-card.server";
import { isProd } from "~/services/utils.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams;
  const jwt = search.get("voter_card") as string;
  try {
    const voterCard = await verifyVoterCard(jwt);
    const cookie =
      (await voterCardCookie.parse(request.headers.get("Cookie"))) ?? {};
    cookie.voter_card = jwt;
    cookie.name = voterCard.name;
    cookie.email = voterCard.email;
    cookie.voted = false;
    return redirect(`/vote?name=${voterCard.name}`, {
      headers: {
        "Set-Cookie": await voterCardCookie.serialize(cookie, {
          secure: isProd,
          httpOnly: true,
          path: "/",
          sameSite: isProd,
        }),
      },
    });
  } catch (error) {
    return redirect(
      `/get-voter-card?error=${encodeURIComponent(
        "It seems your voter card is invalid. Maybe it expired. Please try again.",
      )}`,
    );
  }
};
