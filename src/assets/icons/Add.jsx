import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";
export const Add = (
  { size = 24, color = "#fff", border = 1.5, showCircle = true },
  props
) => (
  <Svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G stroke={color} strokeWidth={border}>
      {showCircle && <Circle cx={12} cy={12} r={10} />}
      <Path strokeLinecap="round" d="M15 12h-3m0 0H9m3 0V9m0 3v3" />
    </G>
  </Svg>
);
