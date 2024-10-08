import { type Node, type NodeProps } from "@xyflow/react";
import { CONSTANTS } from "./constants";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Skull, Vote, Calendar } from "lucide-react"
import { Link } from "@remix-run/react";

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
} satisfies React.CSSProperties;

export function BeginVotingSlide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag m-4 md:m-16 transform scale-100 md:scale-150 xl:scale-250 grid items-center justify-center" style={style}>
    <Card className="w-full max-w-xl mx-auto bg-orange-100 border-2 border-orange-500 shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-5xl font-bold text-orange-800 flex items-center justify-center gap-2">
          <Skull className="w-8 h-8" />
          Begin Voting
          <Skull className="w-8 h-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-xl font-semibold text-orange-700">
          It is time to cast your votes!
        </p>
        <p className="text-lg text-gray-700">
          You will be given 3 votes. The order of your votes matters, so choose wisely!
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Link
        to="/vote"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 text-xl">
          <Vote className="w-5 h-5" />
          Go Vote
        </Link>
      </CardFooter>
    </Card>
  </article>
  )
}
