import { memo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Movie } from "../models/movies";
import { Spinner, VisuallyHidden } from "@radix-ui/themes";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { useFetcher } from "@remix-run/react";
import { loader as movieSearchLoader } from "~/routes/movies-search";

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
  const fetcher = useFetcher<typeof movieSearchLoader>();

  const handleSearch = async(e: any) => {
    const query = e.target.value;
    const data = new FormData();
    data.append("q", query);
    console.log({ data });
    fetcher.load('/movies-search?q=' + query);
  };

  console.log({ fetcher });

  const data = fetcher.state === "idle" ? [...(fetcher.data?.results ?? [])] : [];

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <DialogTitle>Scary Movie Search</DialogTitle>
          <Description>Search for a scary movie to nominate.</Description>
        </VisuallyHidden>
        <CommandInput
          name="q"
          placeholder="Search for a scary movie..."
          onInput={(e: any) => handleSearch(e)}
        />
        <CommandList>
          <CommandEmpty style={{ minHeight: "200px" }}>
            No scary movies found.
          </CommandEmpty>
          <CommandGroup heading="Scary Movies">
              { data.map((movie) => (
                <CommandItem
                  className={`value-${movie.id}`}
                  key={movie.id}
                  value={movie.id + ""}
                  onSelect={() => {
                    console.log("selected: ", movie);
                    onMovieSelect?.(movie);
                  }}
                >
                  {`${movie.title} (${movie.release_date.split("-")[0]})`}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default MovieCommandDialog;
