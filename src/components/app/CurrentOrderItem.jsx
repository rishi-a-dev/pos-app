import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import Theme from "../../theme/Theme";
import { useAppStore } from "../../stores";
import { Add } from "../../assets/icons/Add";
import { Subtract } from "../../assets/icons/Subtract";
import { Delete } from "../../assets/icons/Delete";

export const CurrentOrderItem = ({
  orderedItems,
  removeItem,
  selectedIndex,
}) => {
  const swipeableRef = useRef(null);
  const { width } = useWindowDimensions();
  const { increaseItemQuantity, decreaseItemQuantity } = useAppStore(
    (state) => ({
      increaseItemQuantity: state.increaseItemQuantity,
      decreaseItemQuantity: state.decreaseItemQuantity,
    }),
  );

  const translateX = useRef(new Animated.Value(0)).current;

  const handleQuantityIncrement = (item) => {
    increaseItemQuantity(selectedIndex, item.uuid);
  };

  const handleQuantityDecrement = (item) => {
    decreaseItemQuantity(selectedIndex, item.uuid);
  };

  const handleDeleteItem = (item) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    Animated.timing(translateX, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      removeItem(item);
      translateX.setValue(0);
    });
  };

  const renderRight = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.deleteItem,
          { backgroundColor: Theme.colors.background.accents.red },
        ]}
        onPress={() => handleDeleteItem(item)}
      >
        <Delete size={32} color={Theme.colors.background.accents.white} />
      </TouchableOpacity>
    );
  };

  return orderedItems?.map((item, index) => (
    <Animated.View
      key={index}
      style={[styles.container, { width, transform: [{ translateX }] }]}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => renderRight(item)}
        containerStyle={styles.swipeableContainer}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.itemText}>
            {item.itemName || "Item Name"}{" "}
            <Text style={styles.itemUnit}>{item.unit?.unit}</Text>
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityDecrement(item)}
              style={styles.quantityButton}
            >
              <Animated.View>
                <Subtract size={32} />
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.qty}</Text>
            <TouchableOpacity
              onPress={() => handleQuantityIncrement(item)}
              style={styles.quantityButton}
            >
              <Animated.View>
                <Add size={32} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  ));
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "8%",
    right: 0,
    backgroundColor: Theme.colors.background.accents.blue,
    height: 80,
  },
  swipeableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  innerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  itemText: {
    flex: 1,
    fontSize: Theme.typography.fontSize[20],
    color: Theme.colors.text.secondary.default,
    fontWeight: "600",
    textAlign: "center",
  },
  itemUnit: {
    fontWeight: "400",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  quantityButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: Theme.typography.fontSize[24],
    color: Theme.colors.text.secondary.default,
    paddingHorizontal: 8,
  },
  deleteItem: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
