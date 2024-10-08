import { Slide } from "~/components/slides/slide";
import {
  NodeMouseHandler,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import bgAudio from "~/assets/audio/vote-for-your-nightmare.mp3";
import { MovieSlide } from "~/components/slides/movie-slide";
import { createRef, useCallback, useEffect, useState } from "react";
import { MovieNomination } from "~/models/movies";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { globalMoviesService } from "~/services/movies.service";
import { globalCacheService } from "~/services/cache.service";
import { useLoaderData } from "@remix-run/react";
import { WelcomeSlide } from "~/components/slides/welcome-slide";

const nodeTypes = {
  slide: Slide,
  movieSlide: MovieSlide,
  welcomeSlide: WelcomeSlide,
};

const mainStyle = {
  'gridTemplateColumns': '5rem 1fr 5rem',
};

export interface VotingPresentationProps {
  nominations: MovieNomination[];
}

const VotingPresentation = ({ nominations }: VotingPresentationProps) => {
  const audRef = createRef<HTMLAudioElement>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const audio = audRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const nodes = [
    {
      id: "0",
      type: "welcomeSlide",
      position: { x: 0, y: 0 },
      data: {
        source: `
# SpooktoberFest 2024

## It's time to vote for the movies we'll watch this year!
`,
      },
    },
    ...nominations.map((nom, i) => ({
      id: i + 1 + "",
      type: "movieSlide",
      position: { x: 3000 * (i + 1), y: 0 },
      data: { movieId: nom.id, nominees: nom.nominees },
    })),
  ];

  // Event listener for keydown and change slides to next
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      console.log(e.key);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextSlide = Math.min(currentSlide + 1, nodes.length - 1);
        const nextNode = nodes.find((n) => parseInt(n.id) === nextSlide);
        if (!nextNode) return;
        fitView({ nodes: [nextNode], duration: 250 });
        setCurrentSlide(nextSlide);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const nextSlide = Math.max(currentSlide - 1, 0);
        const prevNode = nodes.find((n) => parseInt(n.id) === nextSlide);
        if (!prevNode) return;
        fitView({ nodes: [prevNode], duration: 250 });
        setCurrentSlide(nextSlide);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, nodes]);

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      setIsPlaying(true);
      const currId = parseInt(node.id);
      const nextNode = nodes.find((n) => parseInt(n.id) > currId);
      if (!nextNode) return;
      fitView({ nodes: [nextNode], duration: 250 });
    },
    [fitView],
  );

  const handleNextSlide = useCallback(() => {
    const nextSlide = Math.min(currentSlide + 1, nodes.length - 1);
    const nextNode = nodes.find((n) => parseInt(n.id) === nextSlide);
    if (!nextNode) return;
    fitView({ nodes: [nextNode], duration: 250 });
    setCurrentSlide(nextSlide);
  }, [currentSlide, nodes, fitView]);

  const handlePrevSlide = useCallback(() => {
    const nextSlide = Math.max(currentSlide - 1, 0);
    const prevNode = nodes.find((n) => parseInt(n.id) === nextSlide);
    if (!prevNode) return;
    fitView({ nodes: [prevNode], duration: 250 });
    setCurrentSlide(nextSlide);
  }, [currentSlide, nodes, fitView]);

  return (
    <>
      <audio ref={audRef}>
        <source src={bgAudio} type="audio/mpeg" />
        <track kind="captions" />
        Your browser does not support the audio element.
      </audio>
      <main className="dark w-[100vw] h-[100dvh] grid" style={mainStyle}>
        <button onClick={handlePrevSlide}>
          {currentSlide > 1 ? '<' : ''}
        </button>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          zoomOnPinch={false}
          zoomOnScroll={false}
          nodesDraggable={false}
          fitView
          fitViewOptions={{ nodes: [{ id: currentSlide + "" }] }}
          onNodeClick={handleNodeClick}
        />
        <button onClick={handleNextSlide}>
          {currentSlide > 0 && currentSlide < nodes.length - 1 ? '>' : ''}
        </button>
      </main>
    </>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  const nomsKeys = await globalCacheService.keys("nominations:*");
  const jsonStrValues = await globalCacheService.mGet(nomsKeys);
  const values = jsonStrValues.map((v) => v && (JSON.parse(v) as unknown));
  const nominations: MovieNomination[] = [];
  const movieIds = new Set<number>();
  const nomineesMap = new Map<number, string[]>();
  for (const nom of values) {
    const nomination = nom as any;
    for (const movieId of nomination.movieIds ?? []) {
      if (!movieIds.has(movieId)) {
        movieIds.add(movieId);
      }
      const nominee = nomination.name;
      const nominees = nomineesMap.get(movieId) ?? [];
      nomineesMap.set(movieId, nominees.concat(nominee));
    }
  }
  for (const movieId of movieIds) {
    const movie = await globalMoviesService.getMovieDetails(movieId + "");
    const nominees = nomineesMap.get(movieId) ?? [];
    nominations.push({
      ...movie,
      nominees,
    });
  }
  return json(
    {
      nominations,
    } satisfies { nominations: MovieNomination[] },
    200,
  );
}

export default () => {
  const { nominations } = useLoaderData<typeof loader>();
  return (
    <ReactFlowProvider>
      <VotingPresentation nominations={nominations as any} />
    </ReactFlowProvider>
  );
};
