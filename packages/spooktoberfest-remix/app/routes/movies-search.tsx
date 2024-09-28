import { json, LoaderFunctionArgs } from "@remix-run/node";
import { globalCacheService } from "~/services/cache.service";
import { MoviesService } from "~/services/movies.service";

export async function loader({
  request,
  context,
}: LoaderFunctionArgs) {
  console.log('Movies search loader', { context });
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const moviesService = new MoviesService(
    process.env.TMDB_API_TOKEN!,
    globalCacheService,
  );
  const resp = await moviesService.searchMovies(query!, 1);
  return json(resp);
}



