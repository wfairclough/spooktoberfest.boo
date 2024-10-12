import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { LoaderFunctionArgs } from "@remix-run/node";

import { globalCacheService } from "../services/cache.service";
import { MovieNomination } from "../models/movies";
import { globalMoviesService } from "../services/movies.service";
import { json, useLoaderData } from "@remix-run/react";

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

export default function VotingRoute() {
  const { nominations: movies } = useLoaderData<typeof loader>();
  const [favorites, setFavorites] = useState<typeof movies>([]);
  const [remainingMovies, setRemainingMovies] = useState(movies);
  const { toast } = useToast();

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        source.droppableId === "favorites" ? favorites : remainingMovies,
        source.index,
        destination.index,
      );

      if (source.droppableId === "favorites") {
        setFavorites(items);
      } else {
        setRemainingMovies(items);
      }
    } else {
      const result = move(
        source.droppableId === "favorites" ? favorites : remainingMovies,
        source.droppableId === "favorites" ? remainingMovies : favorites,
        source,
        destination,
      );

      setFavorites(result.favorites);
      setRemainingMovies(result.remainingMovies);
    }
  };

  const reorder = (
    list: typeof movies,
    startIndex: number,
    endIndex: number,
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    source: typeof movies,
    destination: typeof movies,
    droppableSource: any,
    droppableDestination: any,
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: typeof movies } = {};
    result["favorites"] =
      droppableSource.droppableId === "favorites" ? sourceClone : destClone;
    result["remainingMovies"] =
      droppableSource.droppableId === "favorites" ? destClone : sourceClone;

    return result;
  };

  const handleLockIn = () => {
    if (favorites.length === 3) {
      toast({
        title: "Choices Locked In!",
        description: `Your top 3 movies are: ${favorites.map((m) => m.title).join(", ")}`,
      });
    } else {
      toast({
        title: "Cannot Lock In",
        description: "Please select exactly 3 favorite movies.",
        variant: "destructive",
      });
    }
  };

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
          {remainingMovies.map((movie, index) => (
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
