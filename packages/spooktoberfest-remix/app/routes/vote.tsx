import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { LoaderFunctionArgs } from "@remix-run/node";

import { globalCacheService } from "../services/cache.service";
import { MovieNomination } from "../models/movies";
import { globalMoviesService } from "../services/movies.service";
import { json, useLoaderData } from "@remix-run/react";
import { VoteMovieCard } from "~/components/vote-movie-card";

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
  return json(
    {
      nominations,
      name: searchParams.get("name") as string,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </div>
  );
}
