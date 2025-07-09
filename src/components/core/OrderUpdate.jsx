import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";
import { Delete } from "../../assets/icons/Delete";

const OrderUpdate = ({
  isLandscape,
  selectedItemForEdit,
  setOrderedItems,
  removeItemFromOrder,
  orderedItems,
  setSelectedItemForEdit,
}) => {
  const [updateSelectedItem, setUpdateSelectedItem] = React.useState({
    price: "",
    quantity: "",
    requirement: "",
  });

  React.useEffect(() => {
    if (selectedItemForEdit) {
      setUpdateSelectedItem({
        price: selectedItemForEdit.price.toString(),
        quantity: selectedItemForEdit.quantity.toString(),
        requirement: selectedItemForEdit.requirement,
      });
    }
  }, [selectedItemForEdit]);

  const handleQuantityIncrement = () => {
    setUpdateSelectedItem((prev) => ({
      ...prev,
      quantity: (parseInt(prev.quantity) || 0) + 1,
    }));
  };

  const handleQuantityDecrement = () => {
    setUpdateSelectedItem((prev) => ({
      ...prev,
      quantity: Math.max((parseInt(prev.quantity) || 1) - 1, 1),
    }));
  };

  const handleSaveItem = () => {
    if (selectedItemForEdit) {
      const updatedItems = orderedItems.map((item) =>
        item.id === selectedItemForEdit.id
          ? {
              ...item,
              price: parseFloat(updateSelectedItem.price) || 0,
              quantity: parseInt(updateSelectedItem.quantity) || 0,
              requirement: updateSelectedItem.requirement,
            }
          : item
      );
      setOrderedItems(updatedItems);
      setSelectedItemForEdit(null);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!selectedItemForEdit}
      onRequestClose={() => setSelectedItemForEdit(null)}
    >
      <TouchableWithoutFeedback onPress={() => setSelectedItemForEdit(null)}>
        <View style={styles.itemModalContainer}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.itemModalContent,
                { width: isLandscape ? "30%" : "60%" },
              ]}
            >
              <View style={styles.itemModelContentHeader}>
                <Text style={styles.editItemText}>Edit Quantity</Text>
                <TouchableOpacity onPress={() => setSelectedItemForEdit(null)}>
                  <Close size={Theme.icons.size.xsmall} />
                </TouchableOpacity>
              </View>

              {selectedItemForEdit && (
                <View style={styles.itemNamePriceView}>
                  <View style={styles.itemNameView}>
                    <Text style={styles.itemLabelText}>Item</Text>
                    <Text style={styles.itemText}>
                      {selectedItemForEdit.name}
                    </Text>
                  </View>
                  <View style={styles.itemPriceView}>
                    <Text
                      style={[styles.itemLabelText, { textAlign: "right" }]}
                    >
                      Price
                    </Text>
                    <TextInput
                      style={styles.textPrice}
                      placeholder="Edit Price"
                      value={`₹${updateSelectedItem.price}`}
                      disableFullscreenUI={true}
                      onChangeText={(text) =>
                        setUpdateSelectedItem((prev) => ({
                          ...prev,
                          price: text.replace("₹", ""),
                        }))
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              <View style={styles.editQuantityButtons}>
                <TouchableOpacity
                  onPress={handleQuantityDecrement}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityValue}
                  placeholder="0"
                  disableFullscreenUI={true}
                  value={updateSelectedItem?.quantity?.toString()}
                  onChangeText={(text) => {
                    const quantity = parseInt(text) || 0;
                    setUpdateSelectedItem((prev) => ({
                      ...prev,
                      quantity: Math.max(quantity, 1),
                    }));
                  }}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={handleQuantityIncrement}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.textInputView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Extra sugar"
                  value={updateSelectedItem.requirement}
                  disableFullscreenUI={true}
                  onChangeText={(text) =>
                    setUpdateSelectedItem((prev) => ({
                      ...prev,
                      requirement: text,
                    }))
                  }
                />
              </View>
              <View style={styles.saveBtnView}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveItem}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteBtnView}
                onPress={() => {
                  removeItemFromOrder();
                  setSelectedItemForEdit(null);
                }}
              >
                <Text style={styles.deleteBtnText}>Delete </Text>
                <Delete size={Theme.icons.size.xsmall} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OrderUpdate;

const styles = StyleSheet.create({
  itemModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  itemModalContent: {
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  itemModelContentHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: Theme.border.width.thin,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  editItemText: {
    fontSize: Theme.typography.fontSize[14],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
  },
  editQuantityButtons: {
    width: "40%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  itemNamePriceView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemLabelText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.disabled,
  },
  itemText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
    paddingVertical: 4,
  },
  textPrice: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
    textAlign: "right",
  },
  quantityButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  quantityValue: {
    width: 40,
    paddingHorizontal: 10,
    borderBottomWidth: Theme.border.width.thin,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  textInputView: {
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  textInput: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
    borderBottomWidth: Theme.border.width.thin,
    borderBottomColor: Theme.colors.stroke.secondary,
    paddingHorizontal: 10,
  },
  saveBtnView: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  deleteBtnView: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  saveBtn: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: Theme.colors.background.accents.green,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: Theme.typography.fontSize[14],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.secondary.default,
  },
  deleteBtnText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.accents.red,
  },
});
