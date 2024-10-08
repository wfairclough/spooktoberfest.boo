import { memo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "../models/movies";
import { Spinner, VisuallyHidden } from "@radix-ui/themes";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

export type OnMovieSelect = (movie: Movie) => void;

export interface MovieCommandDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onMovieSelect?: OnMovieSelect;
}

const MovieCommandDialog = ({
  open,
  onOpenChange,
  onMovieSelect,
}: MovieCommandDialogProps) => {
  const [query, setQuery] = useState("");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["movies", query],
    queryFn: async () => {
      const resp = await fetch(
        `/movies-search?q=${encodeURIComponent(query)}`
      );
      return resp.json();
    },
  });

  const movies: ({ label: string; value: string } & Movie)[] = [
    ...(data?.results?.map((movie: Movie) => ({
      ...movie,
      value: movie.id,
      label: movie.release_date ? `${movie.title} (${movie.release_date.split("-")[0]})` : movie.title,
    })) ?? []),
  ];

  console.log(data);

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <DialogTitle>Scary Movie Search</DialogTitle>
          <Description>Search for a scary movie to nominate.</Description>
        </VisuallyHidden>
        <CommandInput
          placeholder="Search for a scary movie..."
          value={query}
          onInput={(e: any) => setQuery(e.target.value)}
        />
        <CommandList>
          <CommandEmpty style={{ minHeight: "200px" }}>
            { isPending ? <Spinner />: isError ? error.message : `No scary movies found.` }
          </CommandEmpty>
          <CommandGroup heading="Scary Movies" onChange={(e) => console.log(e)}>
            {movies.map((movie) => (
              <CommandItem
                className={`value-${movie.value}`}
                key={movie.value}
                value={movie.value}
                onSelect={() => {
                  console.log("selected: ", movie);
                  onMovieSelect?.(movie);
                }}
              >
                {movie.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default memo(MovieCommandDialog);
