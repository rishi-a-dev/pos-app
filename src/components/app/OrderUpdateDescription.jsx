import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Theme from "../../theme/Theme";
import { Options } from "../../assets/icons/Options";

export const OrderUpdateDescription = ({
  item,
  optionShown,
  setShowOptions,
  updateSelectedItem,
  setUpdateSelectedItem,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <View style={[styles.row, { paddingVertical: 0 }]}>
          <Text style={styles.descriptionTitle}>Add Description</Text>
          {item?.itemOptions?.length > 0 && (
            <TouchableOpacity
              style={[
                styles.optionsButton,
                {
                  backgroundColor: Theme.colors.background.primary.disabled,
                },
              ]}
              onPress={() => setShowOptions(!optionShown)}
            >
              <Text style={Theme.typography.H6}>Options</Text>
              <Options size={24} />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          placeholder="Eg: extra sugar"
          value={updateSelectedItem.description}
          onChangeText={(text) =>
            setUpdateSelectedItem((prev) => ({
              ...prev,
              description: text,
            }))
          }
          multiline
          maxLength={200}
          style={styles.descriptionInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    height: 100,
    padding: 8,
    borderRadius: Theme.border.radius.small,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
  },
  descriptionTitle: {
    ...Theme.typography.H3,
  },
  optionsButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: Theme.border.radius.extraLarge,
  },
  descriptionInput: {
    flex: 1,
    width: "100%",
    textAlignVertical: "top",
    ...Theme.typography.H5,
  },
});
