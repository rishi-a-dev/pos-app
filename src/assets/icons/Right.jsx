import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Right({ size = 24, color, stroke = 2 }, props) {
  return (
    <Svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      fill="#000"
      {...props}
    >
      <Path
        fill="none"
        stroke={color || "#fff"}
        strokeWidth={stroke}
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        d="M31 15L48 32 31 49"
      />
      <Path
        fill="none"
        stroke={color || "#fff"}
        strokeWidth={stroke}
        strokeLinejoin="bevel"
        strokeMiterlimit={10}
        d="M16 15L33 32 16 49"
      />
    </Svg>
  );
}
