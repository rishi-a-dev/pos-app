import React from "react";
import { Platform, StatusBar, View } from "react-native";

import { SafeArea } from "./SafeArea";
import Theme from "../../theme/Theme";

export const Screen = ({ full = true, children }) => {
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
