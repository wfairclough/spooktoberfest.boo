import { Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "~/models/movies";
import './movie-poster.css';
import { PlayCircle } from "lucide-react";

export interface ScaryMeterProps {
  movieId: number;
  className?: string;
}

export const MoviePoster = (props: ScaryMeterProps) => {
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

  const hasTrailer = !!movie.trailerUrl;
  const ImgWrapper = hasTrailer ? "a" : "div";
  const imgProps = hasTrailer ? { href: movie.trailerUrl, target: "_blank" } : {};

  return (
    <div>
      <div className="grid place-items-center">
        <ImgWrapper {...imgProps} className="grid">
          <div className="overlay grid w-full h-full place-items-center">
            <PlayCircle className="w-16 h-16 text-white" />
          </div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="h-auto w-auto"
            {...rest}
          />
        </ImgWrapper>
      </div>
    </div>
  );
};
