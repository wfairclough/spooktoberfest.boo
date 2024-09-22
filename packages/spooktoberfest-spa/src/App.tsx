import { createRef, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import { Button } from "./components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./lib/utils";

export interface Movie {
  id: string;
  title: string;
  release_date: string;
  poster_path: string;
}

export interface MovieQuery {
  results: Movie[];
}

function App() {
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const [query, setQuery] = useState("");
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["movies", query],
    queryFn: async () => {
      const resp = await fetch(
        `http://localhost:3000/movies/horror/search?query=${query}&page=1`,
      );
      return resp.json();
    },
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const movies: ({ label: string; value: string } & Movie)[] = [
    ...(data?.results?.map((movie: Movie) => ({
      ...movie,
      value: movie.id,
      label: `${movie.title} (${movie.release_date.split("-")[0]})`,
    })) ?? []),
  ];

  console.log(data);

  const onSelectImg = (movie: Movie) => {
    console.log("onSelectImg: ", movie);
    setSelectedMovie(movie);
  };

  const selectedMoviePosterUrl = selectedMovie
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
    : null;

  const audio = createRef<HTMLAudioElement>();

  // after 5 sec play the audio
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query === "scary") {
        audio.current?.play();
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [query, audio]);

  return (
    <>
      <audio ref={audio} controls>
        <source src="/aud/HailPaemon.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {selectedMoviePosterUrl && (
        <img src={selectedMoviePosterUrl} alt={selectedMovie?.title} />
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for a scary movie..."
          value={query}
          onInput={(e: any) => setQuery(e.target.value)}
        />
        <CommandList>
          <CommandEmpty>No scary movies found.</CommandEmpty>
          <CommandGroup heading="Scary Movies" onChange={(e) => console.log(e)}>
            {movies.map((movie) => (
              <>
                <CommandItem
                  key={movie.value}
                  value={movie.value}
                  onSelect={() => {
                    console.log("selected: ", movie);
                    setSelectedMovie(movie);
                    setOpen(false);
                  }}
                >
                  {movie.label}
                </CommandItem>
              </>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default App;
