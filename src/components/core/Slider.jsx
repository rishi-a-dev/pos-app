import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { Right } from "../../assets/icons/Right";

const Slider = ({
  SLIDER_WIDTH = "100%",
  INITIAL_BOX_SIZE = 40,
  sliderText = "Swipe to Order",
  handleColor = "#f8f9ff",
  trackColor = "#82cab2",
  sliderTrackStyle,
  sliderTextStyle,
  onSuccess,
  disabled = false,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const MAX_VALUE = sliderWidth - (INITIAL_BOX_SIZE + 20);
  const offset = useSharedValue(0);

  const handleSuccess = React.useCallback(() => {
    onSuccess();
    setTimeout(() => {
      offset.value = withTiming(0);
    }, 5000);
  }, [onSuccess]);

  React.useEffect(() => {
    if (disabled) {
      offset.value = withTiming(0);
    }
  }, [disabled, offset]);

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onChange((event) => {
      const newOffset = offset.value + event.changeX;
      if (newOffset <= 0) {
        offset.value = 0;
      } else if (newOffset >= MAX_VALUE) {
        offset.value = MAX_VALUE;
      } else {
        offset.value = newOffset;
      }
    })
    .onEnd(() => {
      if (offset.value >= MAX_VALUE) {
        runOnJS(handleSuccess)();
      } else {
        offset.value = withTiming(0);
      }
    });

  const sliderStyle = useAnimatedStyle(() => ({
    width: INITIAL_BOX_SIZE + offset.value,
  }));

  const handleLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  }, []);

  return (
    <View
      style={[
        styles.sliderTrack,
        { width: SLIDER_WIDTH, backgroundColor: trackColor },
        sliderTrackStyle,
      ]}
      onLayout={handleLayout}
    >
      <Text style={[styles.sliderText, sliderTextStyle]}>{sliderText}</Text>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sliderHandle,
            { backgroundColor: handleColor },
            sliderStyle,
          ]}
        >
          <Right color={"#000"} stroke={4} />
        </Animated.View>
      </GestureDetector>
      {disabled && (
        <View style={styles.loadingOverlay} pointerEvents="box-none">
          <ActivityIndicator color="#f8f9ff" size="small" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderTrack: {
    height: 60,
    justifyContent: "center",
    padding: 10,
    position: "relative",
    overflow: "hidden",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  sliderText: {
    position: "absolute",
    alignSelf: "center",
    color: "#f8f9ff",
    fontWeight: "bold",
  },
  sliderHandle: {
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 8,
  },
});

export default Slider;
