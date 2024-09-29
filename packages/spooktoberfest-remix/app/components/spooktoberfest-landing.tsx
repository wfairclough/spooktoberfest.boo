import { createRef, useState } from "react";
import { GhostIcon, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

import bgAudio from "~/assets/audio/creepy-background.mp3";
import NominationsForm from "./nomintations-form";
import { useMutation } from "@tanstack/react-query";
import { Nomination } from "~/models/nominations";


export default function SpooktoberFestLanding() {
  const audRef = createRef<HTMLAudioElement>();
  const [lockedIn, setLockedIn] = useState(false);

  const handleRunAway = () => {
    console.log(`Ran away`);
  };

  const nominations = useMutation({
    mutationFn: async (noms: Nomination) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = new FormData();
      data.append("name", noms.name);
      data.append("email", noms.email);
      for (const movieId of noms.movies) {
        data.append("movieIds", movieId.toString());
      }
      const resp = await fetch(`/nominations`, {
        method: "POST",
        body: data,
      });
      return resp.json();
    },
  });

  const handleMovieNominations = (params: any) => {
    console.log(params);
    audRef.current?.play();
    nominations.mutate(params);
    setLockedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <audio ref={audRef}>
        <source src={bgAudio} type="audio/mpeg" />
        <track kind="captions" />
        Your browser does not support the audio element.
      </audio>
      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-4 kings-regular">
              SpooktoberFest {new Date().getFullYear()}
            </h2>
            <p className="text-xl mb-8">
              Get ready for a night of thrills, chills, and cinematic spills!
            </p>
            <p className="text-xl mb-8">
              Coming soon to a Katrina and Will&apos;s house near you
            </p>
            <div className="text-center center flex justify-center">
              <GhostIcon className="w-32 h-32 text-white align-middle justify-self-center" />
            </div>
          </div>
        </section>

        <section id="nominate" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {lockedIn
                ? "Your Frightening Flicks are Locked and Loaded!"
                : "Nominate Your Spookiest Movies"}
            </h2>
            <p className="text-center">
              {lockedIn
                ? "The countdown to terror begins... Voting opens on October 7th!"
                : ""}
            </p>
            <NominationsForm
              lockedIn={lockedIn}
              onMoviesNominated={handleMovieNominations}
              onRunAway={handleRunAway}
            />
          </div>
        </section>

        <section id="about" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Event Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center flex-col">
                <CalendarIcon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Date</h3>
                <p>October 19, 2024</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <ClockIcon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Time</h3>
                <p>2:00 PM - Midnight</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <MapPinIcon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p>Our living room, Spookyville</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} SpooktoberFest. All rights
            reserved.
          </p>
          <p className="mt-2">
            Contact us:{" "}
            <a href="mailto:spooktoberfest@willdoes.dev">
              spooktoberfest@willdoes.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
