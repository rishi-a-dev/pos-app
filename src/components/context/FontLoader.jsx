import React, { useState, useEffect } from "react";
import * as Font from "expo-font";

export const FontLoader = ({ children }) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    async function loadCustomFonts() {
      await Font.loadAsync({
        "Montserrat-Medium": require("../../../assets/fonts/Montserrat-Medium.otf"),
        "Montserrat-Regular": require("../../../assets/fonts/Montserrat-Regular.otf"),
        "Montserrat-SemiBold": require("../../../assets/fonts/Montserrat-SemiBold.otf"),
        "Montserrat-Bold": require("../../../assets/fonts/Montserrat-Bold.otf"),
      });

      setIsFontLoaded(true);
    }

    loadCustomFonts();
  }, []);

  return children;
};
