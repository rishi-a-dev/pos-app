import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Portal } from "@gorhom/portal";

export function BottomSheet({
  isOpen,
  toggleSheet,
  duration = 500,
  style,
  children,
}) {
  const screenHeight = Dimensions.get("window").height;
  const height = useSharedValue(screenHeight);
  const [layoutMeasured, setLayoutMeasured] = useState(false);

  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: layoutMeasured
          ? progress.value * 2 * height.value
          : height.value,
      },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: layoutMeasured ? 1 - progress.value : 0,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <Portal>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={sheetStyles.flex} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          setLayoutMeasured(true);
        }}
        style={[sheetStyles.sheet, sheetStyle, style]}
      >
        {children}
      </Animated.View>
    </Portal>
  );
}

const sheetStyles = StyleSheet.create({
  flex: {
    width: "100%",
    height: "100%",
  },
  sheet: {
    padding: 16,
    paddingRight: "2rem",
    paddingLeft: "2rem",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
