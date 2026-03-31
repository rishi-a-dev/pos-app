import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Portal } from "@gorhom/portal";

import Theme from "../../theme/Theme";
import { Add } from "../../assets/icons/Add";
import { Delete } from "../../assets/icons/Delete";
import { Back } from "../../assets/icons/Back";
import { useAppStore } from "../../stores";

export const OrderTableList = ({
  tableList,
  selectedIndex,
  setSelectedIndex,
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 420;
  const navigation = useNavigation();
  const [showRemoveTable, setShowRemoveTable] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const removeOrder = useAppStore((state) => state.removeOrder);
  const setTable = useAppStore((state) => state.setTable);

  const buttonRefs = useRef([]);
  const modalRef = useRef(null);

  let lastTap = null;

  const handleDoubleTap = (index) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      buttonRefs.current[selectedIndex].measure(
        (x, y, width, height, pageX, pageY) => {
          setButtonPosition({ x: pageX, y: pageY });
          setShowRemoveTable(true);
        }
      );
    } else {
      lastTap = now;
      setTimeout(() => {
        lastTap = null;
      }, 300);
    }
  };

  const closeModal = () => {
    setShowRemoveTable(false);
  };

  const handleBackdropPress = () => {
    closeModal();
  };

  const handleRemoveOrder = () => {
    if (selectedIndex >= 0 && selectedIndex < tableList.length) {
      removeOrder(selectedIndex);
      if (tableList.length === 1) {
        closeModal();
        setTable(null);
        navigation.navigate("table");
      } else {
        closeModal();
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollContainer}
        contentContainerStyle={styles.tableContainer}
        showsHorizontalScrollIndicator={false}
      >
        {tableList?.map((table, index) => (
          <TouchableOpacity
            key={index.toString()}
            ref={(ref) => (buttonRefs.current[index] = ref)}
            style={[
              styles.tableView,
              {
                width: isSmallScreen ? 112 : 132,
                backgroundColor:
                  selectedIndex === index
                    ? Theme.colors.background.primary.default
                    : Theme.colors.background.primary.disabled,
              },
            ]}
            onPress={() => setSelectedIndex(index)}
            onPressIn={() => handleDoubleTap(index)}
          >
            <Text
              style={[
                styles.tableText,
                {
                  color:
                    selectedIndex === index
                      ? Theme.colors.text.secondary.default
                      : Theme.colors.text.primary.disabled,
                },
              ]}
            >
              Table {table?.table?.tableName} - {table?.table?.chairName}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("table")}
        >
          <Text style={styles.addButtonText}>
            <Add color="#000" size={48} border={0.8} showCircle={false} />
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {showRemoveTable && (
        <Portal>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={[styles.backdrop, { width: "100%", height: "100%" }]}>
              <View
                style={[
                  styles.modalContainer,
                  {
                    left: buttonPosition.x,
                    top: buttonPosition.y - 48,
                  },
                ]}
                ref={modalRef}
              >
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleRemoveOrder}
                >
                  <Delete color={Theme.colors.text.secondary.default} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={closeModal}
                >
                  <Back />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: "3%",
  },
  scrollContainer: {
    width: "100%",
  },
  tableContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: Theme.border.width.normal,
    borderTopColor: Theme.colors.stroke.secondary,
    columnGap: 0,
  },
  tableView: {
    minWidth: 120,
    maxWidth: 180,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  tableText: {
    ...Theme.typography.H6,
    textAlign: "center",
  },
  addButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    marginLeft: 10,
    borderColor: Theme.colors.stroke.secondary,
    overflow: "hidden",
  },
  addButtonText: {
    ...Theme.typography.H1,
    color: Theme.colors.text.primary.default,
  },
  backdrop: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    flexDirection: "row",
    padding: 4,
    backgroundColor: Theme.colors.text.secondary.default,
    borderRadius: 80,
    elevation: 4,
    columnGap: 4,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "#FD5E53",
  },
  backButton: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: Theme.colors.background.accents.green,
  },
});
