import React from "react";
import { AppState, Dimensions, Platform, StatusBar, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import { SafeArea } from "./SafeArea";
import Theme from "../../theme/Theme";

export const Screen = ({ full = true, children }) => {
  const updateNavBar = React.useCallback(async () => {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync(
        full
          ? Theme.colors.transparent
          : Theme.colors.background.primary.default,
      );
    } catch (error) {
      console.warn("Failed to configure navigation bar", error);
    }
  }, [full]);

  React.useLayoutEffect(() => {
    if (Platform.OS !== "android") return;

    updateNavBar();

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (nextState === "active") {
          updateNavBar();
        }
      },
    );

    const dimensionSubscription = Dimensions.addEventListener(
      "change",
      () => {
        updateNavBar();
      },
    );

    return () => {
      appStateSubscription.remove();
      dimensionSubscription.remove();
    };
  }, [updateNavBar]);

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
