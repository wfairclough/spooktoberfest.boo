import { MovieNomination } from "~/models/movies";
import { Card, CardContent } from "~/components/ui/card";
import './vote-movie-card.css';
import { Circle, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface VoteMovieCard {
  movie: MovieNomination;
  selected: number | null;
  seen: boolean;
  onSelect: (movieId: number, num: number | null) => void;
  onSeenToggle: (movieId: number) => void;
}

export function VoteMovieCard({ movie, seen, selected, onSelect, onSeenToggle }: VoteMovieCard) {

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use the document's viewport
        rootMargin: '0px',
        threshold: 0.8, // Trigger when at least 10% of the element is visible
      }
    );

    const currentElement = ref.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref]);

  const getTitle = (movie: MovieNomination) => {
    return movie.release_date
      ? `${movie.title} (${movie.release_date.slice(0, 4)})`
      : movie.title;
  };

  const hasSelection = selected !== null;

  return (
    <Card 
      ref={ref}
      className={isVisible ? 'bg-gray-700 visible' : 'bg-gray-700'}
    >
      <CardContent className="p-2">
        <div className={`poster ${hasSelection && 'selected'}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={getTitle(movie)}
            className="w-full h-96 object-cover rounded"
          />
          <div className="overlay">
            <button onClick={e => onSelect(movie.id, 1)} className={`grid stack text-green-500 hover:text-green-100 ${selected===1 && 'text-white hover:text-white text-xl font-bold px-5 py-3 bg-green-500 hover:bg-green-600 rounded-full'}`}>
              { selected === 1 ? <></> : <Circle size={56} /> }
              <span>1</span>
            </button>
            <button onClick={e => onSelect(movie.id, 2)} className={`grid stack text-orange-500 hover:text-orange-100 ${selected===2 && 'text-white hover:text-white text-xl font-bold px-5 py-3 bg-orange-500 hover:bg-orange-600 rounded-full'}`}>
              { selected === 2 ? <></> : <Circle size={56} /> }
              <span>2</span>
            </button>
            <button onClick={e => onSelect(movie.id, 3)} className={`grid stack text-blue-500 hover:text-blue-100 ${selected===3 && 'text-white hover:text-white text-xl font-bold px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded-full'}`}>
              { selected === 3 ? <></> : <Circle size={56} /> }
              <span>3</span>
            </button>
            <button onClick={e => onSeenToggle(movie.id)} className={`whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow text-white font-bold py-2 px-4 rounded-full grid row gap-1 text-neutral-300 hover:text-neutral-100 ${seen && 'bg-neutral-100 text-neutral-800 hover:text-neutral-600'}`}>
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


