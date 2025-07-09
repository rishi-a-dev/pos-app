import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { User } from "../../assets/icons/User";
import Theme from "../../theme/Theme";

const ProfileCard = ({ waiter, selectedWaiter, onSelectWaiter }) => {
  const isSelected = selectedWaiter?.id === waiter.id;
  return (
    <TouchableOpacity
      style={[
        styles.profileCard,
        {
          backgroundColor: isSelected
            ? Theme.colors.background.primary.default
            : Theme.colors.transparent,
        },
      ]}
      onPress={() => onSelectWaiter(waiter)}
    >
      <View style={styles.imageView}>
        <User size={80} />
      </View>
      <Text
        style={[
          styles.employeeName,
          {
            color: isSelected
              ? Theme.colors.text.secondary.default
              : Theme.colors.text.primary.default,
          },
        ]}
      >
        {waiter?.name}
      </Text>
      <Text
        style={[
          styles.employeeId,
          {
            color: isSelected
              ? Theme.colors.text.secondary.default
              : Theme.colors.text.primary.default,
          },
        ]}
      >
        {waiter?.code}
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    width: 160,
    padding: "2%",
    alignItems: "center",
  },
  imageView: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  employeeName: {
    ...Theme.typography.H3,
    textAlign: "center",
    marginTop: "2%",
  },
  employeeId: {
    ...Theme.typography.H5,
    marginTop: "1%",
  },
});
