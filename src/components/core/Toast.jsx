import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import Theme from "../../theme/Theme";
import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toast } = useToast();
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const width = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;
  const toastWidth = 300;

  React.useEffect(() => {
    if (toast.visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      width.value = withTiming(toastWidth, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      translateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      opacity.value = withTiming(1, { duration: 500 });
      setTimeout(() => {
        width.value = withTiming(0, {
          duration: 500,
          easing: Easing.in(Easing.exp),
        });
        translateY.value = withTiming(-50, {
          duration: 500,
          easing: Easing.in(Easing.exp),
        });
        opacity.value = withTiming(0, { duration: 500 });
      }, toast.duration - 500);
    }
  }, [toast]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: -width.value / 2 },
      ],
      opacity: opacity.value,
      width: width.value,
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      if (translateY.value > -25) {
        translateY.value = withTiming(-50, {
          duration: 500,
          easing: Easing.in(Easing.exp),
        });
        opacity.value = withTiming(0, { duration: 500 });
        width.value = withTiming(0, {
          duration: 500,
          easing: Easing.in(Easing.exp),
        });
      } else {
        translateY.value = withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
        opacity.value = withTiming(1, { duration: 500 });
        width.value = withTiming(toastWidth, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
      }
    },
  });

  if (!toast.visible) {
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          styles.toastContainer,
          styles[toast.type],
          animatedStyle,
          { left: screenWidth / 2 }, // Center horizontally
        ]}
      >
        <Text style={styles.toastText}>{toast.message}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50, // Position the toast at the top
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  toastText: {
    color: Theme.colors.text.secondary.default,
  },
  info: {
    backgroundColor: Theme.colors.background.accents.blue,
  },
  success: {
    backgroundColor: Theme.colors.background.accents.green,
  },
  warn: {
    backgroundColor: "orange",
  },
  error: {
    backgroundColor: Theme.colors.background.accents.red,
  },
});

export default Toast;
