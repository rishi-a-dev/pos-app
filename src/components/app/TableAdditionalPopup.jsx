import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Portal } from "@gorhom/portal";

import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";

const TableAdditionalPopup = ({
  show,
  tooglePopup,
  showAddItemBtn = true,
  handleNewKOT,
  handleAddItems,
  addItemText = "Add Item",
  secondaryActionText = "New KOT",
  title = "Options",
}) => {
  const { width, height } = Dimensions.get("screen");
  return (
    show && (
      <Portal>
        <TouchableWithoutFeedback onPress={tooglePopup}>
          <Animated.View
            entering={SlideInDown.duration(500)}
            exiting={SlideOutDown.duration(300)}
            style={[styles.backdrop, { width: width, height: height }]}
          >
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
                <TouchableOpacity onPress={tooglePopup}>
                  <Close size={Theme.typography.H1.fontSize} />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                {showAddItemBtn && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: Theme.colors.background.accents.green },
                    ]}
                    onPress={handleAddItems}
                  >
                    <Text style={styles.buttonText}>{addItemText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: Theme.colors.background.primary.default },
                  ]}
                  onPress={handleNewKOT}
                >
                  <Text style={styles.buttonText}>{secondaryActionText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Portal>
    )
  );
};

export default TableAdditionalPopup;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  card: {
    width: 312,
    backgroundColor: Theme.colors.text.secondary.default,
    elevation: 15,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Theme.colors.stroke.secondary,
    borderBottomWidth: Theme.border.width.normal,
    paddingBottom: 16,
  },
  headerText: {
    ...Theme.typography.H2,
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    paddingTop: 8,
    rowGap: 8,
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  buttonText: {
    ...Theme.typography.H2,
    color: Theme.colors.text.secondary.default,
  },
});
