import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { LoaderFunctionArgs } from "@remix-run/node";

import { globalCacheService } from "../services/cache.service";
import { MovieNomination } from "../models/movies";
import { globalMoviesService } from "../services/movies.service";
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
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
    } satisfies { nominations: MovieNomination[] },
    200,
  );
}

export default function VotingRoute() {
  const { nominations: movies } = useLoaderData<typeof loader>();
  const { toast } = useToast();

  const getTitle = (movie: MovieNomination) => {
    return movie.release_date
      ? `${movie.title} (${movie.release_date.slice(0, 4)})`
      : movie.title;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Vote for Your Top 3 Movies
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <Card
              className="bg-gray-700"
            >
              <CardContent className="p-2">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={getTitle(movie)}
                  className="w-full h-96 object-cover rounded"
                />
                <p className="text-sm mt-2 text-center">{getTitle(movie)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
