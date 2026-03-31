import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Theme from "../../theme/Theme";
import { BottomSheet } from "../core/BottomSheet";
import { Close } from "../../assets/icons/Close";

const LogoutConfirm = ({ isOpen, toggleSheet, onConfirm }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      toggleSheet={toggleSheet}
      style={styles.bottomSheet}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Confirm Logout</Text>
        <TouchableOpacity onPress={toggleSheet}>
          <Close />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <Text style={styles.title}>Are you sure you want to logout?</Text>
        <Text style={styles.caption}>
          You will be returned to the login screen and must sign in again.
        </Text>
        <View style={styles.rowView}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttons, styles.cancelButton]}
            onPress={toggleSheet}
          >
            <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttons, styles.logoutButton]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default LogoutConfirm;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Theme.colors.text.secondary.default,
    paddingHorizontal: "4%",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingTop: "2%",
    paddingBottom: "3%",
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
    width: "100%",
    paddingTop: "5%",
    paddingBottom: "3%",
    alignItems: "center",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Theme.colors.background.accents.red,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconText: {
    ...Theme.typography.H2,
    color: Theme.colors.text.secondary.default,
    lineHeight: 20,
  },
  title: {
    ...Theme.typography.H3,
    color: Theme.colors.text.primary.default,
    textAlign: "center",
  },
  caption: {
    ...Theme.typography.H5,
    textAlign: "center",
    color: Theme.colors.text.primary.disabled,
    marginTop: 8,
  },
  rowView: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttons: {
    width: "49%",
    borderRadius: Theme.border.radius.medium,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Theme.colors.background.primary.disabled,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
  },
  logoutButton: {
    backgroundColor: Theme.colors.background.accents.red,
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    ...Theme.typography.H5,
    color: Theme.colors.text.secondary.default,
  },
  cancelText: {
    color: Theme.colors.text.primary.default,
  },
});
