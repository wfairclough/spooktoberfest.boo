import { MovieNomination } from "~/models/movies";
import { Card, CardContent } from "~/components/ui/card";
import './vote-movie-card.css';
import { Circle, Eye } from "lucide-react";

export interface VoteMovieCard {
  movie: MovieNomination;
  selected: number | null;
  seen: boolean;
  onSelect: (movieId: number, num: number | null) => void;
  onSeenToggle: (movieId: number) => void;
}

export function VoteMovieCard({ movie }: VoteMovieCard) {

  const getTitle = (movie: MovieNomination) => {
    return movie.release_date
      ? `${movie.title} (${movie.release_date.slice(0, 4)})`
      : movie.title;
  };

  return (
    <Card className="bg-gray-700">
      <CardContent className="p-2">
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={getTitle(movie)}
            className="w-full h-96 object-cover rounded"
          />
          <div className="overlay">
            <button className="btn btn-primary grid stack text-green-500 hover:text-green-300">
              <Circle size={56} />
              <span>1</span>
            </button>
            <button className="btn btn-primary grid stack text-orange-500 hover:text-orange-300">
              <Circle size={56} />
              <span>2</span>
            </button>
            <button className="btn btn-primary grid stack text-blue-500 hover:text-blue-300">
              <Circle size={56} />
              <span>3</span>
            </button>
            <button className="btn btn-primary grid row gap-1 text-neutral-300 hover:text-neutral-100">
              <Eye size={24} />
              <span>Seen it</span>
            </button>
          </div>
        </div>
        <p className="text-sm mt-2 text-center">{getTitle(movie)}</p>
      </CardContent>
    </Card>
  );
}


