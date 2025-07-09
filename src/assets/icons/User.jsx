import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export function User({ size = 24, circleColor, color }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={40} cy={40} r={40} fill={circleColor || "#D9D9D9"} />
      <Path
        d="M20 54c0-5.523 4.477-10 10-10h20c5.523 0 10 4.477 10 10v8H20v-8z"
        fill={color || "#BDBDBD"}
      />
      <Circle cx={40} cy={29} r={11} fill={color || "#BDBDBD"} />
    </Svg>
  );
}
