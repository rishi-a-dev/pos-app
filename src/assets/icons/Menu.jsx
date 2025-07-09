import React from "react";
import Svg, { Path, G, Mask } from "react-native-svg";

export const Menu = ({ size = 24, colors }, props) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
        width={48}
        height={48}
      >
        <Path fill="#D9D9D9" d="M0 0H48V48H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M6 36v-4h36v4H6zm0-10v-4h36v4H6zm0-10v-4h36v4H6z"
          fill={colors || "#fff"}
        />
      </G>
    </Svg>
  );
};
