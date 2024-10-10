import { type Node, type NodeProps } from "@xyflow/react";
import { CONSTANTS } from "./constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skull, Vote } from "lucide-react";
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

export function VotingStartsShortlySlide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag m-16" style={style}>
      <Card className="w-full max-w-xl mx-auto bg-orange-100 border-2 border-orange-500 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-5xl font-bold text-orange-800 flex items-center justify-center gap-2">
            <Vote className="w-8 h-8" />
            Voting soon
            <Vote className="w-8 h-8" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-xl font-semibold text-orange-700">
            It's almost time to cast your votes!
          </p>
          <p className="text-lg text-gray-700">
            I am working as fast as I can to get the voting system up and
            running.
          </p>
          <p className="text-lg text-gray-700">
            Shut up Libby! I'm working on it!
          </p>
          <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDMzYjNsNGNwaWh5OGs1cWtvbWxybXQya2tjaGhxbTJnZzF6dnZ5ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H3AjY6CLXVkdf2iU52/giphy.gif" alt="Libby Sucks" className="mx-auto" />
        </CardContent>
      </Card>
    </article>
  );
}
