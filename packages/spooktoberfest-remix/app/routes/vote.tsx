import { LoaderFunctionArgs } from "@remix-run/node";
import { globalCacheService } from "../services/cache.service";
import { MovieNomination } from "../models/movies";
import { globalMoviesService } from "../services/movies.service";
import { json, useLoaderData } from "@remix-run/react";
import { Code } from "@radix-ui/themes";

export async function loader({ request }: LoaderFunctionArgs) {
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

const VotingRoute = () => {
  const { nominations } = useLoaderData<typeof loader>();
  return (
    <>
      <div>Voting</div>
      <pre>{JSON.stringify(nominations, null, 2)}</pre>
    </>
  );
};

export default VotingRoute;
