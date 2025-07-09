import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Theme from "../../theme/Theme";
import { BottomSheet } from "../core/BottomSheet";
import { Close } from "../../assets/icons/Close";
import ProfileCard from "./ProfileCard";

export const SideMenu = ({
  isVisible,
  onLogout,
  selectedWaiter,
  setWaiter,
  waiterList,
}) => {
  const handleSelectWaiter = (waiter) => {
    setWaiter(waiter);
  };

  if (!isVisible) {
    return null;
  }

  const isOpen = useSharedValue(false);

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <View style={styles.sideMenu}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.options}
        onPress={toggleSheet}
      >
        <Text style={styles.optionText}>Switch waiter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.options}
        onPress={onLogout}
      >
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
      <BottomSheet
        isOpen={isOpen}
        toggleSheet={toggleSheet}
        style={styles.bottomSheet}
      >
        <View style={styles.header}>
          <Text style={Theme.typography.H2}>Switch waiter</Text>
          <TouchableOpacity onPress={toggleSheet}>
            <Close />
          </TouchableOpacity>
        </View>

        {waiterList.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No employees found.</Text>
            <Text style={styles.emptyText}>
              Please add employee to continue.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {waiterList.map((waiter) => (
              <ProfileCard
                key={waiter.id}
                waiter={waiter}
                selectedWaiter={selectedWaiter}
                onSelectWaiter={handleSelectWaiter}
              />
            ))}
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    flex: 1,
    position: "absolute",
    top: 52,
    right: 18,
    zIndex: 100,
    borderRadius: 4,
    backgroundColor: "white",
    elevation: 5,
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  optionText: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    fontSize: Theme.typography.fontSize[14],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
  },
  bottomSheet: {
    backgroundColor: Theme.colors.text.secondary.default,
    paddingHorizontal: "4%",
    maxHeight: "75%",
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
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...Theme.typography.H5,
    marginBottom: 4,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    padding: "4%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
});
