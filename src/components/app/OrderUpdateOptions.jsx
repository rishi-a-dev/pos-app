import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Theme from "../../theme/Theme";

export const OrderUpdateOptions = ({
  optionShown,
  item,
  updateSelectedItem,
  handleOptionSelect,
}) => {
  return (
    optionShown && (
      <ScrollView
        nestedScrollEnabled
        style={[
          styles.popupOptions,
          {
            position: item?.itemUnits.length > 1 ? "absolute" : "relative",
            bottom: 0,
          },
        ]}
      >
        {item?.itemOptions?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionView,
              {
                backgroundColor: updateSelectedItem.description.includes(
                  option.options
                )
                  ? Theme.colors.background.primary.disabled
                  : Theme.colors.transparent,
              },
            ]}
            onPress={() => handleOptionSelect(option.options)}
          >
            <Text style={Theme.typography.H5}>{option.options}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  );
};

const styles = StyleSheet.create({
  popupOptions: {
    maxHeight: "100%",
    width: "100%",
    zIndex: 1,
    elevation: 18,
    borderRadius: Theme.border.radius.small,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
    backgroundColor: Theme.colors.background.accents.white,
    padding: 4,
  },
  optionView: {
    padding: 4,
    borderRadius: Theme.border.radius.small,
    marginVertical: 2,
  },
});
