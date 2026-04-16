import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";

import { BottomSheet } from "../core/BottomSheet";
import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";
import { useAppStore } from "../../stores";
import { OrderUpdateOptions } from "./OrderUpdateOptions";
import { OrderUpdateUnits } from "./OrderUpdateUnits";
import { OrderUpdateDescription } from "./OrderUpdateDescription";
import { OrderUpdateFooter } from "./OrderUpdateFooter";

const OrderUpdate = ({
  isOpen,
  toggleSheet,
  item,
  selectedIndex,
  removeItemFromOrder,
}) => {
  const [updateSelectedItem, setUpdateSelectedItem] = React.useState({
    rate: "",
    qty: "",
    description: "",
    unit: "",
  });
  const [optionShown, setShowOptions] = React.useState(false);

  const orderList = useAppStore((state) => state.orderList);
  const addItem = useAppStore((state) => state.addItem);
  const updateItem = useAppStore((state) => state.updateItem);

  const keyboard = useAnimatedKeyboard();

  React.useEffect(() => {
    setShowOptions(false);
    if (item) {
      setUpdateSelectedItem({
        rate: item?.rate?.toString(),
        qty: item?.qty?.toString(),
        description: item?.description,
        unit: item?.unit || "",
      });
    }
  }, [item]);

  const handleSaveItem = () => {
    if (item) {
      const uniqueId =
        item?.id + updateSelectedItem.unit.unit + updateSelectedItem.rate;
      const existingItem = orderList[selectedIndex].items?.find(
        (exItem) => exItem.uuid === uniqueId,
      );
      const updateItemData = {
        rate: parseFloat(updateSelectedItem.rate) || 0,
        description: updateSelectedItem.description,
        unit: updateSelectedItem.unit,
        qty:
          parseInt(updateSelectedItem.qty) === 0
            ? 1
            : parseInt(updateSelectedItem.qty),
      };
      if (existingItem) {
        updateItem(selectedIndex, item.uuid, updateItemData);
      } else {
        addItem(selectedIndex, {
          ...item,
          ...updateItemData,
          uuid: uniqueId,
        });
      }
      toggleSheet();
    }
  };

  const handleOptionSelect = React.useCallback((option) => {
    setUpdateSelectedItem((prev) => {
      const currentDescription = prev.description || "";
      const optionRegex = new RegExp(`(^|\\n)${option}(\\n|$)`, "g");
      if (currentDescription.match(optionRegex)) {
        const updatedDescription = currentDescription
          .replace(optionRegex, "")
          .trim();
        return {
          ...prev,
          description: updatedDescription,
        };
      } else {
        const updatedDescription = currentDescription
          ? `${currentDescription}\n${option}`
          : option;
        return {
          ...prev,
          description: updatedDescription,
        };
      }
    });
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  return (
    <BottomSheet
      isOpen={isOpen}
      toggleSheet={toggleSheet}
      style={[styles.bottomSheet, isOpen.value ? animatedStyles : {}]}
    >
      <View style={styles.header}>
        <Text style={Theme.typography.H2}>Item Details</Text>
        <TouchableOpacity onPress={toggleSheet}>
          <Close />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Item</Text>
              <Text style={styles.value}>{item?.itemName}</Text>
            </View>
            <View style={styles.flex2}>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.value}>₹{item?.rate}</Text>
            </View>
          </View>
          <View style={styles.contentSection}>
            <OrderUpdateOptions
              optionShown={optionShown}
              item={item}
              handleOptionSelect={handleOptionSelect}
              updateSelectedItem={updateSelectedItem}
            />

            <OrderUpdateUnits
              item={item}
              updateSelectedItem={updateSelectedItem}
              setUpdateSelectedItem={setUpdateSelectedItem}
            />
          </View>
          <OrderUpdateDescription
            item={item}
            optionShown={optionShown}
            setShowOptions={setShowOptions}
            updateSelectedItem={updateSelectedItem}
            setUpdateSelectedItem={setUpdateSelectedItem}
          />
          <OrderUpdateFooter
            updateSelectedItem={updateSelectedItem}
            setUpdateSelectedItem={setUpdateSelectedItem}
            removeItemFromOrder={() => removeItemFromOrder(item)}
            toggleSheet={toggleSheet}
            handleSaveItem={handleSaveItem}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default OrderUpdate;

const styles = StyleSheet.create({
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
  container: {
    width: "100%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  flex2: {
    flex: 1,
    alignItems: "flex-end",
  },
  label: {
    ...Theme.typography.H5,
    color: Theme.colors.text.primary.disabled,
  },
  value: {
    ...Theme.typography.H3,
    color: Theme.colors.background.accents.blue,
  },
  contentSection: {
    width: "100%",
    maxHeight: 160,
    overflow: "hidden",
  },
});
