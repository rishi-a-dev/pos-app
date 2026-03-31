import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  useWindowDimensions,
} from "react-native";

import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";

export const OrderItemList = ({
  isLandscape,
  modalVisible,
  handleCloseModal,
  data,
}) => {
  const { width } = useWindowDimensions();
  const modalWidth = isLandscape ? Math.min(width * 0.6, 560) : Math.min(width * 0.92, 520);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.itemModalContainer}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.itemModalContent,
                {
                  width: modalWidth,
                  maxHeight: isLandscape ? "80%" : "50%",
                },
              ]}
            >
              <View style={styles.itemModelContentHeader}>
                <Text style={styles.itemHeaderText}>Item Details</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Close size={Theme.icons.size.small} />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.orderMetaRow}>
                  <Text
                    style={[
                      Theme.typography.H4,
                      styles.orderMetaText,
                      styles.orderIdText,
                      { color: Theme.colors.background.accents.blue },
                    ]}
                  >
                    Order {data[0]?.orederNo || ""}
                  </Text>
                  <Text
                    style={[
                      Theme.typography.H4,
                      styles.orderMetaText,
                      { color: Theme.colors.background.accents.blue },
                    ]}
                    numberOfLines={1}
                  >
                    Time: {data[0]?.time || ""}
                  </Text>
                </View>
                <View
                  style={[
                    styles.contentRowView,
                    styles.contentHeader,
                    { padding: "1%" },
                  ]}
                >
                  <Text style={styles.contentHeaderText}>Item name</Text>
                  <Text style={styles.contentHeaderText}>Qty.</Text>
                </View>
                <FlatList
                  data={data}
                  scrollEventThrottle={0.5}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={[styles.contentRowView, { padding: "1%" }]}
                      key={item}
                    >
                      <Text style={[styles.contentText, { flex: 1 }]}>
                        {item.itemName || ""}
                      </Text>
                      <Text style={styles.contentText}>
                        {item.quantity || ""}
                      </Text>
                    </View>
                  )}
                  style={{ flexShrink: 1, paddingHorizontal: 8 }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  itemModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  itemModalContent: {
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    padding: "4%",
  },
  itemModelContentHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "2%",
    marginBottom: "2%",
    borderBottomWidth: Theme.border.width.thin,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  itemHeaderText: {
    ...Theme.typography.H3,
  },
  contentContainer: {
    width: "100%",
    flexShrink: 1,
  },
  orderMetaRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    rowGap: 4,
  },
  orderMetaText: {
    flexShrink: 1,
    maxWidth: "100%",
  },
  orderIdText: {
    width: "100%",
    marginBottom: 2,
  },
  contentRowView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentHeader: {
    backgroundColor: Theme.colors.background.primary.default,
  },
  contentHeaderText: {
    ...Theme.typography.H5,
    color: Theme.colors.text.secondary.default,
  },
  contentText: {
    ...Theme.typography.H5,
  },
});
