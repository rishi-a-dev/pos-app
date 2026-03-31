import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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

const Table = () => {
  const [orderList, setOrderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tableAdditionalPopup, setTableAdditionalPopup] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuShown, showMenu] = useState(false);

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
    const respData = await fetchData(
      `api/v1/restaurent/getItem?transId=${table.transactionID}`,
    );
    console.log("respData", respData);
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
            {tableList?.map((table, index) => {
              // Table is queued when there is any active order for same table/chair.
              // Chair can be null/undefined for non-chair tables, so normalize it.
              const normalizedChairName = table?.chairName ?? "";
              const isQueued = queuedOrders.some(
                (order) =>
                  order?.table?.id === table?.id &&
                  (order?.table?.chairName ?? "") === normalizedChairName,
              );
              const isKotTable =
                table?.transactionID !== null &&
                table?.transactionID !== undefined;

              return (
                <TableCard
                  key={index.toString()}
                  table={table}
                  selectedTable={selectedTable}
                  isQueued={isQueued}
                  isKotTable={isKotTable}
                  handleTable={handleTable}
                  handleLongPress={handleLongPress}
                />
              );
            })}
          </ScrollView>
        )}
        <TableAdditionalPopup
          show={tableAdditionalPopup}
          tooglePopup={() => setTableAdditionalPopup(!tableAdditionalPopup)}
          handleNewKOT={() => handleNewKOT(selectedTable)}
          handleAddItems={() => handleOrders(selectedTable)}
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
  tableCard: {
    width: 172,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
  },
});
