import { type Node, type NodeProps } from "@xyflow/react";
import ScaryMeter from "../scary-meter";
import { MoviePoster } from "../movie-poster";
import { CONSTANTS } from "./constants";
import { MovieTitle } from "../movie-title";
import { MovieSummary } from "../movie-summary";

export const SLIDE_WIDTH = CONSTANTS.SLIDE_WIDTH;
export const SLIDE_HEIGHT = CONSTANTS.SLIDE_HEIGHT;

export type SlideNode = Node<SlideData, "slide">;

export type SlideData = {
  movieId: number;
  nominees: string[];
};

const style = {
  width: `${SLIDE_WIDTH}px`,
  height: `${SLIDE_HEIGHT}px`,
} satisfies React.CSSProperties;

export function MovieSlide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag m-16" style={style}>
      <div className="grid place-items-center h-[90%]">
        <MovieTitle movieId={data.movieId} />
        <MoviePoster className="max-h-[70dvh]" movieId={data.movieId} />
        <MovieSummary movieId={data.movieId} />
        <h4>Nominated By:</h4>
        <ul className="list-disc text-lg">
          {data.nominees.map((nominee) => (<li key={nominee}>{nominee}</li>))}
        </ul>
        <ScaryMeter movieId={data.movieId} />
      </div>
    </article>
  );
}
