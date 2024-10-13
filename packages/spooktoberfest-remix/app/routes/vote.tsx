import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { isProd } from "~/services/utils.server";
import { globalCacheService } from "../services/cache.server";
import { MovieNomination } from "../models/movies";
import { globalMoviesService } from "../services/movies.server";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { VoteMovieCard } from "~/components/vote-movie-card";
import { Button } from "~/components/ui/button";
import { SendHorizontal, Skull } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { voterCardCookie } from "~/services/cookie.server";
import { verifyVoterCard, VoterCard } from "~/services/sign-voter-card.server";
import { submitVotes } from "~/services/submit-votes.server";
import { Resend } from "resend";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const nomsKeys = await globalCacheService.keys("nominations:*");
  const jsonStrValues = await globalCacheService.mGet(nomsKeys);
  const values = jsonStrValues.map((v) => v && (JSON.parse(v) as unknown));
  const nominations: MovieNomination[] = [];
  const movieIds = new Set<number>();
  const nomineesMap = new Map<number, string[]>();
  for (const nom of values) {
    const nomination = nom as any;
    for (const movieId of nomination.movieIds ?? []) {
      if (!movieIds.has(movieId)) {
        movieIds.add(movieId);
      }
      const nominee = nomination.name;
      const nominees = nomineesMap.get(movieId) ?? [];
      nomineesMap.set(movieId, nominees.concat(nominee));
    }
  }
  for (const movieId of movieIds) {
    const movie = await globalMoviesService.getMovieDetails(movieId + "");
    const nominees = nomineesMap.get(movieId) ?? [];
    nominations.push({
      ...movie,
      nominees,
    });
  }

  const cookie = await voterCardCookie.parse(request.headers.get("Cookie"));
  return json(
    {
      nominations,
      name: cookie?.name ?? (searchParams.get("name") as string),
    } satisfies { name: string; nominations: MovieNomination[] },
    200,
  );
}

export default function VotingRoute() {
  const { nominations: movies, name } = useLoaderData<typeof loader>();
  const { toast } = useToast();
  const [num1Movie, setNum1Movie] = useState<number | null>(null);
  const [num2Movie, setNum2Movie] = useState<number | null>(null);
  const [num3Movie, setNum3Movie] = useState<number | null>(null);
  const [seenMovies, setSeenMovies] = useState<Set<number>>(new Set());

  const getSelected = (movieId: number) => {
    if (num1Movie === movieId) {
      return 1;
    } else if (num2Movie === movieId) {
      return 2;
    } else if (num3Movie === movieId) {
      return 3;
    }
    return null;
  };

  const onSelectedChanged = (movieId: number, num: number | null) => {
    console.log(`onSelectedChange`, { movieId, num });
    if (num === 1) {
      setNum1Movie(movieId);
    } else if (num === 2) {
      setNum2Movie(movieId);
    } else if (num === 3) {
      setNum3Movie(movieId);
    }
    if (num1Movie === movieId) {
      setNum1Movie(null);
    } else if (num2Movie === movieId) {
      setNum2Movie(null);
    } else if (num3Movie === movieId) {
      setNum3Movie(null);
    }
  };

  const handleOnSeenToggle = (movieId: number) => {
    if (seenMovies.has(movieId)) {
      seenMovies.delete(movieId);
    } else {
      seenMovies.add(movieId);
    }
    setSeenMovies(new Set(seenMovies));
    console.log(`setSeenMovies`, { seenMovies });
  };

  const canSubmit =
    num1Movie !== null && num2Movie !== null && num3Movie !== null;

  const onRunAway = () => {};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex flex-col gap-4 mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {name}, It's your time to vote.
        </h1>
        <ul className="list mx-auto text-center">
          <li>Vote for the movie you most want to watch as #1.</li>
          <li>Then choose your runner ups as #2 and #3</li>
          <li>Mark a movie as "seen", to help in tie-breaker scenarios</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <VoteMovieCard
              key={movie.id}
              movie={movie as any}
              seen={seenMovies.has(movie.id)}
              onSeenToggle={handleOnSeenToggle}
              selected={getSelected(movie.id)}
              onSelect={onSelectedChanged}
            />
          ))}
        </div>
      </div>
      {canSubmit ? (
        <>
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                <Button className="bg-orange-500 text-primary-foreground hover:bg-orange/90 px-12 py-8 rounded-full shadow-lg">
                  Submit your votes
                  <SendHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="top-[25%] md:top-[50%] lg:top-[50%]"
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  These are your final movie votes for Spooktoberfest 2024. Once
                  locked in, there's no turning back—no second chances, no
                  escape!
                  <br />
                  <br />
                  <ol className="list-decimal list-inside">
                    <li>{movies.find((m) => m.id === num1Movie)?.title}</li>
                    <li>{movies.find((m) => m.id === num2Movie)?.title}</li>
                    <li>{movies.find((m) => m.id === num3Movie)?.title}</li>
                  </ol>
                  <br />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={onRunAway}>
                  Run Away
                </AlertDialogCancel>

                <Form action="/vote" method="post" className="grid">
                  <Input type="hidden" name="num1" value={num1Movie + ""} />
                  <Input type="hidden" name="num2" value={num2Movie + ""} />
                  <Input type="hidden" name="num3" value={num3Movie + ""} />
                  {Array.from(seenMovies).map((movieId) => (
                    <input
                      key={movieId}
                      type="hidden"
                      name="seen[]"
                      value={movieId + ""}
                    />
                  ))}
                  <AlertDialogAction type="submit">
                    Seal My Fate!
                    <Skull className="ml-2 h-4 w-4" />
                  </AlertDialogAction>
                </Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await voterCardCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect(
      `/get-voter-card?error=${encodeURIComponent("You must request a voter card before voting.")}`,
    );
  }
  console.log({ cookie });
  let voterCard!: VoterCard;
  try {
    voterCard = await verifyVoterCard(cookie.voter_card);
  } catch (error) {
    return redirect(
      `/get-voter-card?error=${encodeURIComponent("It seems your voter card is invalid. Maybe it expired. Please try again.")}`,
    );
  }
  const formData = await request.formData();
  const num1 = formData.get("num1") as string;
  const num2 = formData.get("num2") as string;
  const num3 = formData.get("num3") as string;
  const seen = formData.getAll("seen[]");
  console.log({ num1, num2, num3, seen });

  await submitVotes(
    {
      first: num1,
      second: num2,
      third: num3,
    },
    seen.map((id) => id.toString()),
    voterCard,
  );

  cookie.voted = "true";

  try {
    const movies = await Promise.all([
      globalMoviesService.getMovieDetails(num1),
      globalMoviesService.getMovieDetails(num2),
      globalMoviesService.getMovieDetails(num3),
    ]);
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "SpookyBot <spooky_bot@vote.spooktoberfest.boo>",
      to: [cookie.email],
      subject: "Your Spooktoberfest Votes are submitted!",
      html: `
      <p>Hey there, ${cookie.name}! 👋</p>
      <p>Thank you for submiting your votes for Spooktoberfest 2024.</p>
      <p>
        Your votes:
        <ol>
          <li>${movies[0].title}</li>
          <li>${movies[1].title}</li>
          <li>${movies[2].title}</li>
        </ol>
      </p>
      <p>We are excited to see everyone on October 19th</p>
      <br/>
      <address>
          <strong>Katrina and Will's Home</strong><br>
          228 Latchford Road<br>
          Ottawa, ON, K1Z 1B9<br>
          Canada<br>
      </address>
      <br/>
      <p>Thanks for participating in Spooktoberfest! 🎃👻</p>
    `,
    });
  } catch (err) {
    return redirect(
      `/get-voter-card?error=${encodeURIComponent(
        "Oh no! Something went wrong. Please try again later.",
      )}`,
    );
  }

  return redirect("/see-you-soon", {
    headers: {
      "Set-Cookie": await voterCardCookie.serialize(cookie, {
        secure: isProd,
        httpOnly: true,
        path: "/",
        sameSite: isProd,
      }),
    },
  });
}
