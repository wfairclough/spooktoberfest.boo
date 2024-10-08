import { type Node, type NodeProps } from "@xyflow/react";
import ScaryMeter from "../scary-meter";
import { MoviePoster } from "../movie-poster";
import { CONSTANTS } from "./constants";
import { MovieTitle } from "../movie-title";
import { MovieSummary } from "../movie-summary";
import { useState } from "react";

export const SLIDE_WIDTH = CONSTANTS.SLIDE_WIDTH;
export const SLIDE_HEIGHT = CONSTANTS.SLIDE_HEIGHT;

export type SlideNode = Node<SlideData, "slide">;

export type SlideData = {
  movieId: number;
  nominees: string[];
};

const style = {
  width: `${SLIDE_WIDTH}`,
  height: `${SLIDE_HEIGHT}`,
  maxWidth: '500px',
} satisfies React.CSSProperties;

export function MovieSlide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag sm:m-8 lg:m-16" style={style}>
      <div className="grid place-items-center h-[90%]">
        <MovieTitle movieId={data.movieId} />
        <MoviePoster className="max-h-[35dvh] lg:max-h-[70dvh]" movieId={data.movieId} />
        <MovieSummary movieId={data.movieId} />
        <h4>Nominated By:</h4>
        <ul className="list-disc list-inside text-lg grid gap-6 justify-items-center w-full p-6" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))'}}>
          {data.nominees.map((nominee) => (<li key={nominee}>{nominee}</li>))}
        </ul>
        <ScaryMeter className="max-h-[35dvh] lg:max-h-[50dvh]" movieId={data.movieId} />
      </div>
    </article>
  );
}
