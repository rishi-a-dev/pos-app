import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SafeArea = ({ children, top = true, bottom = true }) => {
  const insets = useSafeAreaInsets();
  const styles = {
    flex: 1,
    paddingTop: top ? insets.top : 0,
    paddingBottom: bottom ? insets.bottom : 0,
  };
  return <View style={styles}>{children}</View>;
};
