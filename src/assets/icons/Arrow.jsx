import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";

export function Arrow({ size = 24, color, style }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      <Mask
        id="a"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={18}
        height={18}
      >
        <Path transform="rotate(-90 0 18)" fill="#D9D9D9" d="M0 18H18V36H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M15.75 7.493l-7.313 7.644-7.312-7.644 1.298-1.356 6.014 6.286 6.015-6.286 1.298 1.356z"
          fill={color || "#fff"}
        />
      </G>
    </Svg>
  );
}
