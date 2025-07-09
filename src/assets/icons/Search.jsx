import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";

export function Search({ size = 24, color }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
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
        width={25}
        height={24}
      >
        <Path fill="#D9D9D9" d="M0.5 0H24.5V24H0.5z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M20.1 21l-6.3-6.3A6.096 6.096 0 0110 16c-1.817 0-3.354-.63-4.612-1.887C4.129 12.854 3.5 11.317 3.5 9.5c0-1.817.63-3.354 1.888-4.612C6.646 3.629 8.183 3 10 3c1.817 0 3.354.63 4.613 1.888C15.87 6.146 16.5 7.683 16.5 9.5a6.096 6.096 0 01-1.3 3.8l6.3 6.3-1.4 1.4zM10 14c1.25 0 2.313-.438 3.188-1.313.874-.874 1.312-1.937 1.312-3.187 0-1.25-.438-2.313-1.313-3.188C12.313 5.438 11.25 5 10 5c-1.25 0-2.313.438-3.188 1.313S5.5 8.25 5.5 9.5c0 1.25.438 2.313 1.313 3.188C7.688 13.562 8.75 14 10 14z"
          fill={color || "#fff"}
        />
      </G>
    </Svg>
  );
}
