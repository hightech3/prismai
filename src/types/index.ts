import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type IResponse = {
  id: string;
  query: string;
  answer: string;
  graph_data?: JSON[] | null;
  frontier_data?: JSON | null;
}
