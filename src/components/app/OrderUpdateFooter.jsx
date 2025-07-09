import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Subtract } from "../../assets/icons/Subtract";
import Theme from "../../theme/Theme";
import { Add } from "../../assets/icons/Add";

export const OrderUpdateFooter = ({
  updateSelectedItem,
  setUpdateSelectedItem,
  removeItemFromOrder,
  toggleSheet,
  handleSaveItem,
}) => {
  const handleQuantityDecrement = () => {
    setUpdateSelectedItem((prev) => ({
      ...prev,
      qty: Math.max((parseInt(prev.qty) || 1) - 1, 1),
    }));
  };
  const handleQuantityIncrement = () => {
    setUpdateSelectedItem((prev) => ({
      ...prev,
      qty: (parseInt(prev.qty) || 0) + 1,
    }));
  };
  return (
    <>
      <View style={styles.quantityRow}>
        <TouchableOpacity onPress={handleQuantityDecrement}>
          <Subtract color={Theme.colors.background.accents.black} size={32} />
        </TouchableOpacity>
        <TextInput
          placeholder="1"
          value={updateSelectedItem?.qty?.toString()}
          onChangeText={(text) => {
            const qty = parseInt(text) || 0;
            setUpdateSelectedItem((prev) => ({
              ...prev,
              qty: qty,
            }));
          }}
          cursorColor={Theme.colors.stroke.secondary}
          style={styles.quantityInput}
          maxLength={3}
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={handleQuantityIncrement}>
          <Add size={32} color={Theme.colors.background.accents.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => {
            removeItemFromOrder();
            toggleSheet();
          }}
        >
          <Text style={styles.buttonText}>Delete item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleSaveItem}
        >
          <Text style={styles.buttonText}>Add item</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  quantityRow: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    width: "20%",
    ...Theme.typography.H1,
    textAlign: "center",
    marginHorizontal: "4%",
    color: Theme.colors.text.primary.default,
    borderBottomWidth: Theme.border.width.normal,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  buttonRow: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  button: {
    width: "49%",
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: Theme.colors.background.accents.red,
  },
  addButton: {
    backgroundColor: Theme.colors.background.accents.green,
  },
  buttonText: {
    ...Theme.typography.H6,
    color: Theme.colors.text.secondary.default,
  },
});
