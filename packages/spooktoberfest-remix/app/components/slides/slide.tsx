import { type Node, type NodeProps } from "@xyflow/react";
import { Remark } from "react-remark";
import { CONSTANTS } from "./constants";

export const SLIDE_WIDTH = CONSTANTS.SLIDE_WIDTH;
export const SLIDE_HEIGHT = CONSTANTS.SLIDE_HEIGHT;

export type SlideNode = Node<SlideData, "slide">;

export type SlideData = {
  source: string;
};

const style = {
  width: `${SLIDE_WIDTH}`,
  height: `${SLIDE_HEIGHT}`,
} satisfies React.CSSProperties;

export function Slide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="slide nodrag" style={style}>
      <Remark>{data.source}</Remark>
    </article>
  );
}
