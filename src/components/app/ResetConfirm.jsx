import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BottomSheet } from "../core/BottomSheet";
import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";

export const ResetConfirm = ({ isOpen = false, toggleSheet, onConfirm }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      toggleSheet={toggleSheet}
      style={styles.bottomSheet}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Reset App</Text>
        <TouchableOpacity onPress={toggleSheet}>
          <Close />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.caption}>
          Resetting the app will remove all the login credentials from app.
        </Text>
        <Text
          style={[
            styles.caption,
            Theme.typography.H3,
            { textAlign: "center", marginTop: "3%" },
          ]}
        >
          Do you wish to proceed?
        </Text>
        <View style={styles.rowView}>
          <TouchableOpacity
            style={[
              styles.buttons,
              { backgroundColor: Theme.colors.background.accents.red },
            ]}
            onPress={toggleSheet}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttons,
              { backgroundColor: Theme.colors.background.accents.green },
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Theme.colors.text.secondary.default,
    paddingHorizontal: "4%",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingVertical: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.text.primary.disabled,
  },
  headerText: {
    ...Theme.typography.H2,
  },
  contentContainer: {
    padding: "3%",
  },
  caption: {
    ...Theme.typography.H4,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "5%",
  },
  buttons: {
    width: "49%",
    paddingVertical: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    ...Theme.typography.H2,
    color: Theme.colors.text.secondary.default,
  },
});
