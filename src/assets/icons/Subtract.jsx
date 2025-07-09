import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

export const Subtract = ({ size = 24, color }, props) => (
  <Svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G stroke={color || "#fff"} strokeWidth={props.border || 1.5}>
      <Circle cx={12} cy={12} r={10} />
      <Path strokeLinecap="round" d="M15 12H9" />
    </G>
  </Svg>
);
