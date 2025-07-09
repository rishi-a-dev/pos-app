import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Right } from "../../assets/icons/Right";
import Theme from "../../theme/Theme";

const { width: screenWidth } = Dimensions.get("window");

export const AnimatedButton = ({ showRightDrawer, onPress }) => {
  const rotate = useRef(new Animated.Value(showRightDrawer ? 0 : 180)).current;
  const translateX = useRef(
    new Animated.Value(
      showRightDrawer ? -0.5 * screenWidth : -0.0 * screenWidth
    )
  ).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: showRightDrawer ? -0.5 * screenWidth : -0.0 * screenWidth,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(rotate, {
        toValue: showRightDrawer ? 0 : 180,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showRightDrawer]);

  const animatedStyle = {
    transform: [
      { translateX },
      {
        rotate: rotate.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Right />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    right: 4,
    top: "8%",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.background.primary.default,
    justifyContent: "center",
    alignItems: "center",
  },
});
