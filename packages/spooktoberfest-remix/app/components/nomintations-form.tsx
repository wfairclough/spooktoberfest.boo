import { Box, Card, Inset, Text, Strong } from "@radix-ui/themes";
import MovieCommandDialog from "./movie-cmd-dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Movie } from "../models/movies";

const NominationsForm = () => {
  const [openMovieSearchDialog, setOpenMovieSearchDialog] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenMovieSearchDialog((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    console.log("selected: ", movie);
    setOpenMovieSearchDialog(false);
    setSelectedMovies([movie, ...selectedMovies].slice(0, 2));
  };

  let nomBtnText = "Nominate your movies";
  let nomBtnClasses = "bg-orange-500 hover:bg-orange-600";
  if (selectedMovies.length === 1) {
    nomBtnText = "Nominate your next movie";
    nomBtnClasses = "bg-orange-500 hover:bg-orange-600";
  } else if (selectedMovies.length === 2) {
    nomBtnText = `Lock in your nominations`;
    nomBtnClasses = "bg-green-500 hover:bg-green-600";
  }

  return (
    <>
      <div className="flex justify-evenly m-6">
        <Button
          className={`${nomBtnClasses} text-black sm:w-full md:w-6/12 text-2xl`}
          onClick={() => setOpenMovieSearchDialog(true)}
        >
          {nomBtnText}
        </Button>
        {selectedMovies.length > 0 && ( 
        <Button
          className='bg-slate-400 hover:bg-slate-500 text-black sm:w-full md:w-6/12 text-2xl'
          onClick={() => setSelectedMovies([])}
        >
          Clear nominations
        </Button>
        )}

      </div>

      <div className="min-w-full flex justify-evenly sm:items-center sm:flex-col">
        {selectedMovies.map((movie) => (
          <Box key={movie.id} maxWidth="340px" className="mt-6">
            <Card size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="Bold typography"
                  style={{
                    display: "block",
                    objectFit: "cover",
                    width: "100%",
                    height: 140,
                    backgroundColor: "var(--gray-5)",
                  }}
                />
              </Inset>
              <Text as="p" size="3">
                <Strong>{movie.title}</Strong>
                <br />
                {movie.overview}
              </Text>
            </Card>
          </Box>
        ))}
      </div>

      <MovieCommandDialog
        open={openMovieSearchDialog}
        onOpenChange={setOpenMovieSearchDialog}
        onMovieSelect={handleMovieSelect}
      />
    </>
  );
};

export default NominationsForm;
