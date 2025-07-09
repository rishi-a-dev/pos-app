import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Back(props) {
  return (
    <Svg
      className="icon icon-tabler icon-tabler-arrow-back-up"
      fill="none"
      height={24}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M9 13L5 9l4-4M5 9h11a4 4 0 010 8h-1" />
    </Svg>
  );
}
