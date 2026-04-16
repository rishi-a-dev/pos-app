import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Theme from "../../theme/Theme";
import { Arrow } from "../../assets/icons/Arrow";
import { Delete } from "../../assets/icons/Delete";
import Slider from "../core/Slider";
import { useAppStore } from "../../stores";
import { BottomSheet } from "../core/BottomSheet";
import { Close } from "../../assets/icons/Close";
import { TableCard } from "./TableCard";
import { SectionButton } from "./SectionButton";
import TableAdditionalPopup from "./TableAdditionalPopup";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const OrderList = ({
  isLandscape,
  showRightDrawer,
  kotFetching = false,
  isPrinting = false,
  handlePrintButtonPress,
  orderedItems,
  setSelectedItemForEdit,
  toggleSheet,
  selectedIndex,
}) => {
  const [isExpandedViewVisible, setExpandedViewVisible] = useState(false);
  const [tableAdditionalPopup, setTableAdditionalPopup] = useState(false);

  const removeAllItems = useAppStore((state) => state.removeAllItems);
  const sectionList = useAppStore((state) => state.sections);
  const tableList = useAppStore((state) => state.tables);
  const selectedSection = useAppStore((state) => state.section);
  const updateOrder = useAppStore((state) => state.updateOrder);
  const setTableList = useAppStore((state) => state.setTablesList);

  const isOpen = useSharedValue(false);

  const toggleBottomSheet = () => {
    isOpen.value = !isOpen.value;
  };

  const animatedTranslateX = React.useRef(
    new Animated.Value(showRightDrawer ? 0 : SCREEN_WIDTH * 0.75),
  ).current;

  React.useEffect(() => {
    Animated.timing(animatedTranslateX, {
      toValue: showRightDrawer ? 0 : SCREEN_WIDTH * 0.75,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [showRightDrawer]);

  const calculateTotalItemCount = () =>
    orderedItems?.items?.reduce((total, item) => total + item?.qty, 0);
  const calculateTotalPrice = () =>
    orderedItems?.items?.reduce(
      (total, item) =>
        total + (item?.unit?.sellingPrice || item?.rate) * item?.qty,
      0,
    );

  const clearAllOrders = () => {
    removeAllItems(selectedIndex);
  };

  const handleSection = (section) => {
    const update = {
      section: section,
      table: table,
    };
    updateOrder(selectedIndex, update);
  };

  const handleNewKOT = (table) => {
    const existingChairs = tableList
      .filter((t) => t.tableName === table.tableName)
      .map((t) => t.chairName)
      .filter((name) => name !== null)
      // .filter(Boolean) // Ensure non-null chair names
      .map(Number);
    let nextChairNumber = 1;
    while (existingChairs.includes(nextChairNumber)) {
      nextChairNumber++;
    }

    const newTable = {
      ...table,
      chairName: nextChairNumber.toString().padStart(2, "0"),
    };

    setTableList([...tableList, newTable]);
    const update = {
      section: selectedSection,
      table: newTable,
    };
    updateOrder(selectedIndex, update);
    setTableAdditionalPopup(false);
  };

  const handleTable = (table) => {
    if (table.id === orderedItems?.table?.id) {
      setTableAdditionalPopup(true);
    } else {
      const update = {
        section: selectedSection,
        table: table,
      };
      updateOrder(selectedIndex, update);
    }
  };

  return (
    <Animated.View
      style={[
        styles.orderMainSectionView,
        !isLandscape && {
          transform: [{ translateX: animatedTranslateX }],
          width: "50%",
          position: "absolute",
          right: 0,
          height: "100%",
          backgroundColor: Theme.colors.background.accents.white,
          zIndex: 1,
        },
      ]}
    >
      <View style={styles.orderHeaderBarView}>
        <View style={styles.orderHeaderBar}>
          <Pressable onPress={toggleBottomSheet}>
            <Text style={styles.orderNo}>
              Order - Table {orderedItems?.table?.tableName}
            </Text>
          </Pressable>
          <View style={styles.totalOrderFlexView}>
            <Text style={styles.totalOrdersText}>Total</Text>
            <TouchableOpacity
              style={styles.totalOrderPriceView}
              activeOpacity={0.7}
              onPress={() => {
                setExpandedViewVisible(!isExpandedViewVisible);
              }}
            >
              <Text style={styles.totalOrdersText}>
                ₹{calculateTotalPrice()?.toFixed(2)}{" "}
              </Text>
              <Arrow
                style={{
                  transform: [
                    { rotate: isExpandedViewVisible ? "180deg" : "0deg" },
                  ],
                }}
                size={Theme.icons.size.xsmall}
              />
            </TouchableOpacity>
          </View>
          {isExpandedViewVisible && (
            <View style={styles.expandedView}>
              <View style={styles.expandedRowView}>
                <Text style={styles.expandedRowHeadText}>Sub Total</Text>
                <Text style={styles.expandedRowPriceText}>
                  ₹{calculateTotalPrice()?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.expandedRowView}>
                <View>
                  <Text style={styles.expandedRowHeadText}>Discount (%)</Text>
                </View>
                <Text style={styles.expandedRowPriceText}>₹0</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.addedItemsView}>
        <View style={styles.addedItemsFlexView}>
          <Text style={styles.addeditemsText}>
            {calculateTotalItemCount()} Item
            {calculateTotalItemCount() !== 1 ? "s" : ""} added!
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.totalOrderPriceView}
            onPress={clearAllOrders}
          >
            <Text style={styles.clearaddedItemsText}>Clear All</Text>
            <Delete size={Theme.icons.size.xsmall} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemlistMainView}>
        <View style={styles.listRowView}>
          <Text style={styles.listRowsNo}>No</Text>
          <Text style={styles.listRowsItem}>Item</Text>
          <Text style={styles.listRowsNo}>Qty.</Text>
          <Text style={styles.listRowsPrice}>Price</Text>
        </View>
        {orderedItems?.items?.length === 0 ? (
          <Text style={styles.emptyStateText}>No items added yet!</Text>
        ) : (
          // Render the list of items
          <ScrollView>
            {orderedItems?.items?.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  toggleSheet();
                  setSelectedItemForEdit(item);
                }}
                style={styles.itemsListRowView}
                key={item.uuid}
              >
                <Text style={styles.listRowsNo}>{index + 1}.</Text>
                <View style={styles.itemListRowsItemView}>
                  <Text style={styles.itemListRowsItem}>
                    {item.itemName} {`(${item.unit.unit || ""})`}
                  </Text>
                  {item.description && (
                    <View style={styles.requirmentView}>
                      <Text style={styles.requirmentText}>
                        {item.description}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.listRowsNo}>{item.qty}</Text>
                <Text style={styles.listRowsPrice}>
                  {item.unit.sellingPrice || item.rate}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.printButtonView}>
        <Slider
          onSuccess={handlePrintButtonPress}
          disabled={kotFetching || isPrinting}
          sliderText={
            kotFetching
              ? "Loading kitchen print data…"
              : isPrinting
                ? "Printing to kitchen…"
                : "Swipe to print KOT"
          }
          trackColor={Theme.colors.background.accents.dark}
          sliderTextStyle={{ ...Theme.typography.H4 }}
        />
      </View>
      <BottomSheet
        isOpen={isOpen}
        toggleSheet={toggleBottomSheet}
        style={styles.bottomSheet}
      >
        <View style={styles.header}>
          <Text style={Theme.typography.H2}>Switch table</Text>
          <TouchableOpacity onPress={toggleBottomSheet}>
            <Close />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionView}>
          {sectionList.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No section found.</Text>
              <Text style={styles.emptyText}>
                Please add section to continue.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              contentContainerStyle={styles.horizontalScrollContainer}
            >
              {sectionList.map((section, index) => (
                <SectionButton
                  key={section.id}
                  section={section}
                  index={index}
                  sectionListLength={sectionList.length}
                  selectedSection={orderedItems?.section}
                  handleSection={handleSection}
                />
              ))}
            </ScrollView>
          )}
        </View>
        {tableList.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No tables found.</Text>
            <Text style={styles.emptyText}>
              Please choose a section to continue.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {tableList.map((table, index) => (
              <TableCard
                key={index.toString()}
                table={table}
                selectedTable={orderedItems?.table}
                handleTable={handleTable}
              />
            ))}
          </ScrollView>
        )}
        <TableAdditionalPopup
          handleNewKOT={() => handleNewKOT(orderedItems?.table)}
          showAddItemBtn={false}
          show={tableAdditionalPopup}
          tooglePopup={() => setTableAdditionalPopup(!tableAdditionalPopup)}
        />
      </BottomSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  orderMainSectionView: {
    width: "30%",
    borderLeftWidth: Theme.border.width.thin,
    borderLeftColor: Theme.colors.stroke.secondary,
  },
  orderHeaderBarView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.background.primary.default,
  },
  orderHeaderBar: {
    width: "100%",
    paddingTop: 8,
  },
  totalOrderFlexView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  totalOrderPriceView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  orderNo: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    textAlign: "left",
    color: Theme.colors.text.secondary.default,
    paddingHorizontal: 14,
  },
  totalOrdersText: {
    fontSize: Theme.typography.fontSize[14],
    fontFamily: "Montserrat-SemiBold",
    textAlign: "left",
    color: Theme.colors.text.secondary.default,
  },
  expandedView: {
    width: "100%",
    backgroundColor: Theme.colors.background.primary.muted,
    paddingVertical: 8,
  },
  expandedRowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  expandedRowHeadText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
  },
  expandedRowPriceText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Regular",
    color: Theme.colors.text.primary.default,
  },
  addedItemsView: {
    width: "100%",
    borderBottomWidth: Theme.border.width.thin,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  addedItemsFlexView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  addeditemsText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    textAlign: "left",
    color: Theme.colors.text.primary.default,
  },
  clearaddedItemsText: {
    fontSize: Theme.typography.fontSize[14],
    fontFamily: "Montserrat-SemiBold",
    textAlign: "left",
    color: Theme.colors.text.accents.red,
  },
  itemlistMainView: {
    flex: 1,
  },
  listRowView: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 4,
  },
  listRowsNo: {
    width: "14%",
    textAlign: "center",
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
  },
  listRowsItem: {
    flex: 1,
    textAlign: "center",
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
  },
  listRowsPrice: {
    width: "30%",
    textAlign: "center",
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
  },
  itemsListRowView: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: Theme.colors.background.primary.muted,
  },
  itemListRowsItemView: {
    flex: 1,
  },
  itemListRowsItem: {
    textAlign: "left",
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
  },
  requirmentView: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Theme.colors.background.accents.brown,
    alignSelf: "flex-start",
  },
  requirmentText: {
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.accents.default,
  },

  printButtonView: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  printButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  printText: {
    fontSize: Theme.typography.fontSize[16],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.secondary.default,
    paddingLeft: 5,
  },
  emptyStateText: {
    ...Theme.typography.H5,
    color: Theme.colors.text.primary.default,
    textAlign: "center",
    paddingVertical: 20,
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
  sectionView: {
    width: "100%",
    flexDirection: "row",
    padding: "3%",
    alignItems: "center",
    borderBottomWidth: Theme.border.width.normal,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tableCard: {
    width: 172,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
  },
});
