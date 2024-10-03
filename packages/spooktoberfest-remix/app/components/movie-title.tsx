import { Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "~/models/movies";

export interface MovieTitleProps {
  movieId: number;
  className?: string;
}

export const MovieTitle = (props: MovieTitleProps) => {
  const { movieId, ...rest } = props;

  const {
    isPending,
    isError,
    data: movie,
    error,
  } = useQuery({
    queryKey: ["poster", movieId],
    queryFn: async () => {
      const resp = await fetch(`/movies/${movieId}`);
      const movie = await resp.json();
      return movie as Movie;
    },
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <strong className="text-destructive">{error.message}</strong>;
  }
  const title = movie.release_date?.split('-')?.[0] ? `${movie.title} (${movie.release_date?.split('-')?.[0]})` : movie.title;
  console.log("MovieTitle", { movie });
  return (
    <h1 className="text-4xl font-bold" {...rest}>
      { title }
    </h1>
  );
};

