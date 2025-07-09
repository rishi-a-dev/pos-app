import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";

export function MoreVert({ size = 24, color }, props) {
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
          d="M24 40c-1.1 0-2.042-.392-2.825-1.175C20.392 38.042 20 37.1 20 36s.392-2.042 1.175-2.825C21.958 32.392 22.9 32 24 32s2.042.392 2.825 1.175C27.608 33.958 28 34.9 28 36s-.392 2.042-1.175 2.825C26.042 39.608 25.1 40 24 40zm0-12c-1.1 0-2.042-.392-2.825-1.175C20.392 26.042 20 25.1 20 24s.392-2.042 1.175-2.825C21.958 20.392 22.9 20 24 20s2.042.392 2.825 1.175C27.608 21.958 28 22.9 28 24s-.392 2.042-1.175 2.825C26.042 27.608 25.1 28 24 28zm0-12c-1.1 0-2.042-.392-2.825-1.175C20.392 14.042 20 13.1 20 12s.392-2.042 1.175-2.825C21.958 8.392 22.9 8 24 8s2.042.392 2.825 1.175C27.608 9.958 28 10.9 28 12s-.392 2.042-1.175 2.825C26.042 15.608 25.1 16 24 16z"
          fill={color || "#fff"}
        />
      </G>
    </Svg>
  );
}
