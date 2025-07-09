import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Food({ size = 50, color }, props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 273 273"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M211.492 272.501h20.543c10.395 0 18.934-7.92 20.171-18.067l20.419-203.94H210.75V.375h-24.379v50.119h-61.503l3.712 28.957c21.161 5.817 40.961 16.335 52.841 27.968 17.82 17.572 30.071 35.763 30.071 65.463v99.619zM.375 260.126v-12.251h185.996v12.251c0 6.806-5.568 12.375-12.498 12.375h-161c-6.93 0-12.498-5.569-12.498-12.375zm185.996-86.625c0-99-185.996-99-185.996 0h185.996zM.622 198.375h185.626v24.75H.623v-24.75z"
        fill={color || "#989898"}
      />
    </Svg>
  );
}
