import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Close({ size = 24, color }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.867 25.334L7 23.467 14.467 16 7 8.534l1.867-1.867 7.466 7.467L23.8 6.667l1.867 1.867L18.2 16l7.467 7.467-1.867 1.867-7.467-7.467-7.466 7.467z"
        fill={color || "#222"}
      />
    </Svg>
  );
}
