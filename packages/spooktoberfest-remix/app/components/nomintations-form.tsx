import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Box, Card, Inset, Text, Strong, Spinner } from "@radix-ui/themes";
import MovieCommandDialog from "./movie-cmd-dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Movie } from "../models/movies";
import { Input } from "./ui/input";
import { Nomination } from "~/models/nominations";
import { Lock } from "lucide-react";
import ScaryMeter from "./scary-meter";

export interface NominationsFormProps {
  lockedIn: boolean;
  onMoviesNominated: (params: Nomination) => void;
  onRunAway: () => void;
}

const NominationsForm = ({ lockedIn, onMoviesNominated, onRunAway }: NominationsFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  const nominationButtons = (() => {
    if (lockedIn) {
      return undefined;
    }
    if (selectedMovies.length === 0) {
      return (
        <>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-blacksm:w-full md:w-6/12 text-2xl justify-self-center"
            onClick={() => setOpenMovieSearchDialog(true)}
          >
            Nominate your movies
          </Button>
        </>
      );
    } else if (selectedMovies.length >= 1) {
      return (
        <>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-black md:w-6/12 text-2xl justify-self-center"
            onClick={() => setOpenMovieSearchDialog(true)}
          >
            {selectedMovies.length === 1
              ? "Nominate another movie"
              : "Replace a movie"}
          </Button>
          <Button
            className="bg-slate-500 hover:bg-slate-600 text-black md:w-6/12 text-2xl justify-self-center"
            onClick={() => setSelectedMovies([])}
          >
            Reset
          </Button>
        </>
      );
    }
  })();

  const lockInNominationButton = (() => {
    if (lockedIn) {
      return undefined;
    }
    if (selectedMovies.length === 2) {
      return (
        <>
          <div className="grid gap-2 mt-6">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="bg-green-500 hover:bg-green-600 text-black h-16 text-2xl justify-self-center">
                  <Lock size={24} className="mr-2" />
                  Lock in nominations
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are You Daring Enough?</AlertDialogTitle>
                  <AlertDialogDescription>
                    These are your final nominations for Spooktoberfest 2024.
                    Once locked in, there's no turning back—no second chances,
                    no escape!
                    <br />
                    <br />
                    <form className="m-2 flex flex-col gap-2">
                      <Input type="text" autoFocus autoComplete="off" placeholder="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                      <Input type="email" placeholder="Email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </form>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={onRunAway}>Run Away</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!name || !email}
                    onClick={() =>
                      onMoviesNominated({
                        name: name,
                        email: email,
                        movies: selectedMovies.map((m) => m.id),
                      })
                    }
                  >
                    Seal My Fate!
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      );
    }
    return undefined;
  })();

  return (
    <>
      <div className="grid gap-2">{nominationButtons}</div>

      <div className="min-w-full flex justify-evenly items-start flex-col sm:flex-col sm:items-start md:flex-row lg:flex-row xl:flex-row">
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
                    height: 360,
                    backgroundColor: "var(--gray-5)",
                  }}
                />
              </Inset>
              <Text as="p" size="3">
                <Strong>{movie.title}</Strong>
                <br />
                {movie.overview}
              </Text>
              <ScaryMeter movieId={movie.id} /> 
            </Card>
          </Box>
        ))}
      </div>

      {lockInNominationButton}

      <MovieCommandDialog
        open={openMovieSearchDialog}
        onOpenChange={setOpenMovieSearchDialog}
        onMovieSelect={handleMovieSelect}
      />
    </>
  );
};

export default NominationsForm;
