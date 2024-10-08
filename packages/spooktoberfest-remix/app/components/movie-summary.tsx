import { Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "~/models/movies";

export interface ScaryMeterProps {
  movieId: number;
  className?: string;
}

export const MovieSummary = (props: ScaryMeterProps) => {
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

  return (
    <div>
      <p>
        {movie.overview}
      </p>
    </div>
  );
};
