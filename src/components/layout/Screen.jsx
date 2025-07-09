import React from "react";
import { Platform, StatusBar, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import { SafeArea } from "./SafeArea";
import Theme from "../../theme/Theme";

export const Screen = ({ full = true, children }) => {
  React.useLayoutEffect(() => {
    const updateNavBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setPositionAsync("absolute");
        await NavigationBar.setBackgroundColorAsync(
          full
            ? Theme.colors.transparent
            : Theme.colors.background.primary.default
        );
      } catch (error) {
        alert(error?.message || "Some error occured");
      }
    };
    if (Platform.OS === "android") {
      updateNavBar();
    }
  }, []);

  return full ? (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
        hidden={true}
      />
      {children}
    </View>
  ) : (
    <SafeArea>{children}</SafeArea>
  );
};
