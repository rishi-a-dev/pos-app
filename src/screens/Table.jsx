import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";

import Theme from "../theme/Theme";
import { useAppStore } from "../stores";
import { AppBar } from "../components/app/AppBar";
import { SideMenu } from "../components/app/SideMenu";
import { useFetchData } from "../components/hooks/useFetchData";
import { OrderItemList } from "../components/app/OrderItemList";
import { useOrientation } from "../components/context/OrientationContext";
import { TableCard } from "../components/app/TableCard";
import { SectionButton } from "../components/app/SectionButton";
import TableAdditionalPopup from "../components/app/TableAdditionalPopup";
import LogoutConfirm from "../components/app/LogoutConfirm";
import { BottomSheet } from "../components/core/BottomSheet";
import { Close } from "../assets/icons/Close";

const Table = () => {
  const [orderList, setOrderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tableAdditionalPopup, setTableAdditionalPopup] = useState(false);
  const [popupContext, setPopupContext] = useState("table");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuShown, showMenu] = useState(false);
  const [selectedTableGroupKey, setSelectedTableGroupKey] = useState(null);

  const sectionList = useAppStore((state) => state.sections);
  const setSectionList = useAppStore((state) => state.setSectionsList);
  const tableList = useAppStore((state) => state.tables);
  const setTableList = useAppStore((state) => state.setTablesList);
  const selectedSection = useAppStore((state) => state.section);
  const selectedTable = useAppStore((state) => state.table);
  const setSection = useAppStore((state) => state.setSection);
  const setTable = useAppStore((state) => state.setTable);
  const addNewOrder = useAppStore((state) => state.addNewOrder);
  const queuedOrders = useAppStore((state) => state.orderList);
  const waiterList = useAppStore((state) => state.waiters);
  const selectedWaiter = useAppStore((state) => state.waiter);
  const setWaiter = useAppStore((state) => state.setWaiter);
  const dbData = useAppStore((state) => state.dbData);
  const setDbData = useAppStore((state) => state.setDbData);
  const clearOrders = useAppStore((state) => state.clearOrders);

  const navigation = useNavigation();
  const isLandscape = useOrientation();
  const { fetchData } = useFetchData();
  const isLogoutConfirmOpen = useSharedValue(false);
  const isChairSheetOpen = useSharedValue(false);

  const getTableList = async (id) => {
    const respData = await fetchData(
      `api/v1/restaurent/fillTable?sectionId=${id}`,
    );
    if (respData) {
      setTableList(respData.data);
    }
  };

  const getSectionList = async () => {
    const respData = await fetchData("api/v1/restaurent/getSection");
    if (respData) {
      setSectionList(respData.data);
    }
  };

  useEffect(() => {
    setOrderList([]);
    getSectionList();
    if (selectedSection) {
      getTableList(selectedSection?.id);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getSectionList();
      if (selectedSection?.id) {
        getTableList(selectedSection.id);
      }
    }, [selectedSection?.id]),
  );

  const handleSection = (section) => {
    setSection(section);
    setSelectedTableGroupKey(null);
    isChairSheetOpen.value = false;
    setTableAdditionalPopup(false);
    getTableList(section.id);
  };

  const handleNewKOT = (table) => {
    const existingChairs = tableList
      .filter((t) => t.tableName === table.tableName)
      .map((t) => t.chairName)
      .filter((name) => name !== null)
      // .filter(Boolean) // Ensure non-null chair names
      .map(Number); // Convert chair names to numbers for comparison
    // Find the next available chair number
    let nextChairNumber = 1;
    while (existingChairs.includes(nextChairNumber)) {
      nextChairNumber++;
    }

    // Create a new table with the next available chair number
    const newTable = {
      ...table,
      chairName: nextChairNumber.toString().padStart(2, "0"),
    };

    setTableList([...tableList, newTable]);
    handleOrders(newTable);
  };

  const handleTable = (table) => {
    const isQueued = queuedOrders.some(
      (order) =>
        order?.table?.id === table?.id &&
        (order?.table?.chairName ?? "") === (table?.chairName ?? ""),
    );
    const isKotTable =
      table?.transactionID !== null && table?.transactionID !== undefined;

    if (isQueued || isKotTable) {
      setPopupContext("table");
      setTable(table);
      setTableAdditionalPopup(true);
    } else {
      handleOrders(table);
    }
  };

  const handleOrders = (table) => {
    const existingOrder = queuedOrders.find(
      (order) =>
        order?.table?.id === table?.id &&
        (order?.table?.chairName ?? "") === (table?.chairName ?? ""),
    );

    setTable(table);
    setTableAdditionalPopup(false);

    if (!existingOrder) {
      const newOrder = {
        section: selectedSection,
        table: table,
        items: [],
      };
      addNewOrder(newOrder);
    }

    navigation.navigate("dashboard");
  };

  const handleLongPress = async (table) => {
    if (!table?.transactionID) {
      return;
    }
    const respData = await fetchData(
      `api/v1/restaurent/getItem?transId=${table.transactionID}`,
    );
    if (respData?.data?.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setOrderList(respData.data || []);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setOrderList([]);
    setModalVisible(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getSectionList();
      if (selectedSection?.id) {
        await getTableList(selectedSection.id);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleSideMenu = () => {
    showMenu(!isMenuShown);
  };

  const handleLogout = () => {
    showMenu(false);
    isLogoutConfirmOpen.value = true;
  };

  const handleConfirmLogout = () => {
    isLogoutConfirmOpen.value = false;
    setDbData(
      dbData
        ? {
            ...dbData,
            token: null,
            adminname: null,
            username: null,
          }
        : null,
    );
    setWaiter(null);
    setTable(null);
    clearOrders();
    navigation.navigate("auth", { screen: "login" });
  };

  const toggleLogoutConfirm = () => {
    isLogoutConfirmOpen.value = !isLogoutConfirmOpen.value;
  };

  const toggleChairSheet = () => {
    isChairSheetOpen.value = !isChairSheetOpen.value;
  };

  const handleChairTap = (chair) => {
    setPopupContext("chair");
    setTable(chair);
    setTableAdditionalPopup(true);
  };

  const handleChairListItems = () => {
    isChairSheetOpen.value = false;
    setTableAdditionalPopup(false);
    handleLongPress(selectedTable);
  };

  const handleChairAddItems = () => {
    isChairSheetOpen.value = false;
    setTableAdditionalPopup(false);
    handleOrders(selectedTable);
  };

  const tableGroups = useMemo(() => {
    const groupedMap = tableList.reduce((acc, table) => {
      const key = table?.tableName || `table-${table?.id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(table);
      return acc;
    }, {});

    return Object.entries(groupedMap).map(([key, chairs]) => ({
      key,
      tableName: key,
      chairs: [...chairs].sort((a, b) =>
        String(a?.chairName || "").localeCompare(String(b?.chairName || "")),
      ),
    }));
  }, [tableList]);

  const selectedTableGroup = useMemo(() => {
    if (!selectedTableGroupKey) {
      return null;
    }
    return (
      tableGroups.find((group) => group.key === selectedTableGroupKey) || null
    );
  }, [selectedTableGroupKey, tableGroups]);

  useEffect(() => {
    if (!tableGroups.length) {
      setSelectedTableGroupKey(null);
      return;
    }

    if (
      !selectedTableGroupKey ||
      !tableGroups.some((g) => g.key === selectedTableGroupKey)
    ) {
      setSelectedTableGroupKey(tableGroups[0].key);
    }
  }, [tableGroups, selectedTableGroupKey]);

  return (
    <TouchableWithoutFeedback onPress={() => showMenu(false)}>
      <View style={styles.container}>
        <AppBar onToggleSideMenu={toggleSideMenu} />
        <SideMenu
          isVisible={isMenuShown}
          onLogout={handleLogout}
          waiterList={waiterList}
          setWaiter={setWaiter}
          selectedWaiter={selectedWaiter}
        />
        <View style={styles.sectionView}>
          <Text style={styles.sectionHeader}>Tables</Text>
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
                  selectedSection={selectedSection}
                  handleSection={handleSection}
                />
              ))}
            </ScrollView>
          )}
        </View>
        {tableList.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.emptyScrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No tables found.</Text>
              <Text style={styles.emptyText}>
                Please choose a section to continue.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {tableGroups?.map((tableGroup, index) => {
              const isQueued = tableGroup.chairs.some((chair) =>
                queuedOrders.some(
                  (order) =>
                    order?.table?.id === chair?.id &&
                    (order?.table?.chairName ?? "") ===
                      (chair?.chairName ?? ""),
                ),
              );
              const isKotTable = tableGroup.chairs.some(
                (chair) =>
                  chair?.transactionID !== null &&
                  chair?.transactionID !== undefined,
              );
              const chairCount = tableGroup.chairs.filter(
                (chair) => chair?.chairName,
              ).length;
              const hasMultipleChairs = chairCount > 1;
              const primaryChair = tableGroup.chairs[0];

              return (
                <TableCard
                  key={index.toString()}
                  table={primaryChair}
                  selected={selectedTableGroupKey === tableGroup.key}
                  isQueued={isQueued}
                  isKotTable={isKotTable}
                  title={`Table ${tableGroup.tableName}`}
                  subtitle={
                    hasMultipleChairs
                      ? `${chairCount} chairs • View Chairs`
                      : "Single chair table"
                  }
                  onPress={() => {
                    if (hasMultipleChairs) {
                      setSelectedTableGroupKey(tableGroup.key);
                      isChairSheetOpen.value = true;
                      return;
                    }
                    setSelectedTableGroupKey(tableGroup.key);
                    handleTable(primaryChair);
                  }}
                />
              );
            })}
          </ScrollView>
        )}
        <BottomSheet
          isOpen={isChairSheetOpen}
          toggleSheet={toggleChairSheet}
          style={styles.chairSheet}
        >
          <View style={styles.chairSheetHeader}>
            <View>
              <Text style={styles.chairListTitle}>
                Table {selectedTableGroup?.tableName || ""} - Chairs
              </Text>
              <Text style={styles.chairListHint}>
                Tap a chair to view getItems
              </Text>
            </View>
            <View style={styles.chairSheetHeaderActions}>
              <TouchableOpacity
                style={styles.addChairButton}
                onPress={() => {
                  const tableForChair =
                    selectedTableGroup?.chairs?.[0] || selectedTable;
                  if (tableForChair) {
                    isChairSheetOpen.value = false;
                    handleNewKOT(tableForChair);
                  }
                }}
              >
                <Text style={styles.addChairButtonText}>+ Add Chair</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleChairSheet}>
                <Close />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.chairCountBadge}>
            <Text style={styles.chairCountBadgeText}>
              {selectedTableGroup?.chairs?.length || 0} Total
            </Text>
          </View>
          <View style={styles.chairListBody}>
            <ScrollView
              style={styles.chairScroll}
              contentContainerStyle={styles.chairGrid}
              showsVerticalScrollIndicator={true}
            >
              {(selectedTableGroup?.chairs || []).map((chair, index) => {
                const isKotChair =
                  chair?.transactionID !== null &&
                  chair?.transactionID !== undefined;
                const normalizedChairName = chair?.chairName ?? "";
                const isQueued = queuedOrders.some(
                  (order) =>
                    order?.table?.id === chair?.id &&
                    (order?.table?.chairName ?? "") === normalizedChairName,
                );

                return (
                  <TouchableOpacity
                    key={`${chair?.id}-${index}`}
                    style={[
                      styles.chairChip,
                      isQueued
                        ? styles.chairChipQueued
                        : isKotChair
                          ? styles.chairChipActive
                          : null,
                    ]}
                    onPress={() => handleChairTap(chair)}
                  >
                    <View style={styles.chairChipHeader}>
                      <Text
                        style={[
                          styles.chairChipText,
                          (isKotChair || isQueued) &&
                            styles.chairChipTextActive,
                        ]}
                      >
                        Chair {chair?.chairName || index + 1}
                      </Text>
                      <View
                        style={[
                          styles.chairStatusPill,
                          isQueued
                            ? styles.chairStatusPillQueued
                            : isKotChair
                              ? styles.chairStatusPillKot
                              : styles.chairStatusPillEmpty,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chairStatusPillText,
                            isQueued
                              ? styles.chairStatusPillTextQueued
                              : isKotChair
                                ? styles.chairStatusPillTextKot
                                : styles.chairStatusPillTextEmpty,
                          ]}
                        >
                          {isQueued
                            ? "Queued"
                            : isKotChair
                              ? "Active"
                              : "Empty"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.chairChipSubText}>
                      {isKotChair ? "Tap to open item list" : "No running KOT"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </BottomSheet>
        <TableAdditionalPopup
          show={tableAdditionalPopup}
          tooglePopup={() => setTableAdditionalPopup(!tableAdditionalPopup)}
          title={popupContext === "chair" ? "Chair Options" : "Options"}
          addItemText="Add Item"
          secondaryActionText={
            popupContext === "chair" ? "List Items" : "New KOT"
          }
          handleNewKOT={() =>
            popupContext === "chair"
              ? handleChairListItems()
              : handleNewKOT(selectedTable)
          }
          handleAddItems={() =>
            popupContext === "chair"
              ? handleChairAddItems()
              : handleOrders(selectedTable)
          }
        />
        <OrderItemList
          isLandscape={isLandscape}
          modalVisible={modalVisible}
          data={orderList}
          handleCloseModal={handleCloseModal}
        />
        <LogoutConfirm
          isOpen={isLogoutConfirmOpen}
          toggleSheet={toggleLogoutConfirm}
          onConfirm={handleConfirmLogout}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Table;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionView: {
    width: "100%",
    flexDirection: "row",
    padding: "3%",
    alignItems: "center",
    borderBottomWidth: Theme.border.width.normal,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  sectionHeader: {
    ...Theme.typography.H2,
    marginRight: "4%",
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyScrollContainer: {
    flexGrow: 1,
  },
  emptyText: {
    ...Theme.typography.H5,
    marginBottom: 4,
  },
  horizontalScrollContainer: {
    alignItems: "center",
  },
  sectionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Theme.colors.background.primary.disabled,
  },
  sectionContainerFirst: {
    borderTopLeftRadius: Theme.border.radius.medium,
    borderBottomLeftRadius: Theme.border.radius.medium,
  },
  sectionContainerLast: {
    borderTopRightRadius: Theme.border.radius.medium,
    borderBottomRightRadius: Theme.border.radius.medium,
  },
  sectionName: {
    ...Theme.typography.H5,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: "3%",
    paddingVertical: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chairSheet: {
    maxHeight: "75%",
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    rowGap: 8,
  },
  chairSheetHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chairSheetHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  addChairButton: {
    backgroundColor: Theme.colors.background.primary.default,
    borderRadius: Theme.border.radius.medium,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addChairButtonText: {
    ...Theme.typography.H6,
    color: Theme.colors.text.secondary.default,
  },
  chairCountBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E8F0FF",
    borderWidth: Theme.border.width.thin,
    borderColor: "#C7D9FF",
  },
  chairCountBadgeText: {
    ...Theme.typography.H6,
    color: Theme.colors.background.accents.blue,
  },
  chairListTitle: {
    ...Theme.typography.H4,
    color: Theme.colors.text.primary.default,
  },
  chairListHint: {
    ...Theme.typography.H6,
    color: Theme.colors.text.primary.disabled,
  },
  chairListBody: {
    flex: 1,
    minHeight: 120,
  },
  chairScroll: {
    flex: 1,
  },
  chairGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 8,
    paddingVertical: 4,
  },
  chairChip: {
    width: "48%",
    minWidth: 140,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
    borderRadius: Theme.border.radius.medium,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Theme.colors.background.primary.muted,
    rowGap: 6,
  },
  chairChipActive: {
    borderColor: Theme.colors.background.accents.blue,
    backgroundColor: "#E8F0FF",
  },
  chairChipQueued: {
    borderColor: "#F2B46E",
    backgroundColor: "#FFF4E6",
  },
  chairChipHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },
  chairChipText: {
    ...Theme.typography.H5,
    color: Theme.colors.text.primary.default,
  },
  chairChipTextActive: {
    color: Theme.colors.text.primary.default,
  },
  chairChipSubText: {
    ...Theme.typography.H6,
    color: Theme.colors.text.primary.disabled,
  },
  chairStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: Theme.border.width.thin,
  },
  chairStatusPillEmpty: {
    backgroundColor: "#F2F4F7",
    borderColor: "#DCE1E8",
  },
  chairStatusPillKot: {
    backgroundColor: "#DCEAFF",
    borderColor: "#9FC0FF",
  },
  chairStatusPillQueued: {
    backgroundColor: "#FFE4C2",
    borderColor: "#F2B46E",
  },
  chairStatusPillText: {
    ...Theme.typography.H6,
  },
  chairStatusPillTextEmpty: {
    color: Theme.colors.text.primary.disabled,
  },
  chairStatusPillTextKot: {
    color: Theme.colors.background.accents.blue,
  },
  chairStatusPillTextQueued: {
    color: "#AA5A00",
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
