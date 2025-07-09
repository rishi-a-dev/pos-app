import React, { createContext, useContext, useState, useEffect } from "react";
import { Dimensions } from "react-native";

const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get("window").width > Dimensions.get("window").height
  );

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(
        Dimensions.get("window").width > Dimensions.get("window").height
      );
    };

    Dimensions.addEventListener("change", updateOrientation);

    return () => {
      Dimensions.removeEventListener("change", updateOrientation);
    };
  }, []);

  return (
    <OrientationContext.Provider value={isLandscape}>
      {children}
    </OrientationContext.Provider>
  );
};

export const useOrientation = () => {
  return useContext(OrientationContext);
};
