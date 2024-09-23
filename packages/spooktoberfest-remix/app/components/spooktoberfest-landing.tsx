import { createRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { GhostIcon, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

import bgAudio from "~/assets/audio/creepy-background.mp3";
import NominationsForm from "./nomintations-form";

export default function SpooktoberFestLanding() {
  const audRef = createRef<HTMLAudioElement>();
  const [movie1, setMovie1] = useState("");
  const [movie2, setMovie2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle form submission here
    console.log("Nominated movies:", movie1, movie2);
    // Reset form
    setMovie1("");
    setMovie2("");

    audRef?.current?.play();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <audio ref={audRef} autoPlay loop>
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
            {/* <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Learn More
            </Button> */}
            <div className="text-center center flex justify-center">
              <GhostIcon className="w-32 h-32 text-white align-middle justify-self-center" />
            </div>
          </div>
        </section>

        <section id="nominate" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Nominate Your Spooky Movies
            </h2>
            <NominationsForm />
            {/* <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <Label htmlFor="movie1">Movie 1</Label>
                <Input
                  id="movie1"
                  value={movie1}
                  onChange={(e) => setMovie1(e.target.value)}
                  placeholder="Enter your first movie nomination"
                  required
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="movie2">Movie 2</Label>
                <Input
                  id="movie2"
                  value={movie2}
                  onChange={(e) => setMovie2(e.target.value)}
                  placeholder="Enter your second movie nomination"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Submit Nominations
              </Button>
            </form> */}
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
