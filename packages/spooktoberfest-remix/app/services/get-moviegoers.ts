import { Moviegoer } from "~/models/moviegoer";
import { globalCacheService } from "./cache.service";

export const getMoviegoers = async (): Promise<Moviegoer[]> => {
  const moviegoers: Moviegoer[] = [];
  for await (const key of globalCacheService.getScanner("nominations:*")) {
    const moviegoerData = await globalCacheService.mGet([key]);
    if (!moviegoerData) {
      continue;
    }
    moviegoers.push(...moviegoerData.map((data) => data && JSON.parse(data)));
  }
  return moviegoers;
};
