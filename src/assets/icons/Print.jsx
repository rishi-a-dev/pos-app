import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";

export function Print({ size = 24, color }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
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
        width={24}
        height={24}
      >
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M16 8V5H8v3H6V3h12v5h-2zm2 4.5c.283 0 .52-.096.712-.287A.968.968 0 0019 11.5a.968.968 0 00-.288-.713A.968.968 0 0018 10.5a.968.968 0 00-.712.287.968.968 0 00-.288.713c0 .283.096.52.288.713.191.191.429.287.712.287zM16 19v-4H8v4h8zm2 2H6v-4H2v-6c0-.85.292-1.563.875-2.137C3.458 8.288 4.167 8 5 8h14c.85 0 1.563.287 2.137.863.575.575.863 1.287.863 2.137v6h-4v4zm2-6v-4a.968.968 0 00-.288-.713A.968.968 0 0019 10H5a.967.967 0 00-.713.287A.968.968 0 004 11v4h2v-2h12v2h2z"
          fill={color || "#fff"}
        />
      </G>
    </Svg>
  );
}
