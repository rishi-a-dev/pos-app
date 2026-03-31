import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  BackHandler,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import TcpSocket from "react-native-tcp-socket";
import { useNavigation } from "@react-navigation/native";

import Theme from "../theme/Theme";
import { useAppStore } from "../stores";
import { AppBar } from "../components/app/AppBar";
import { printToPrinter } from "../components/utils/Printer";
import { MenuList } from "../components/app/MenuList";
import { OrderList } from "../components/app/OrderList";
import { CurrentOrderItem } from "../components/app/CurrentOrderItem";
import { SideMenu } from "../components/app/SideMenu";
import { useOrientation } from "../components/context/OrientationContext";
import { AnimatedButton } from "../components/app/AnimatedButton";
import OrderUpdate from "../components/app/OrderUpdate";
import { useFetchData } from "../components/hooks/useFetchData";
import { OrderTableList } from "../components/app/OrderTableList";
import { createPostOrderItem } from "../components/utils/PostOrderItemStructure";
import LogoutConfirm from "../components/app/LogoutConfirm";

const Dashboard = () => {
  const navigation = useNavigation();
  const isLandscape = useOrientation();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuShown, showMenu] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [printerJobs, setPrinterJobs] = useState([]);
  const [printerGroups, setPrinterGroups] = useState([]); // [{ printerName, items }]
  const [isPrinting, setIsPrinting] = useState(false);
  const hasFinalizedRef = React.useRef(false);
  const finalizeMetaRef = React.useRef({
    initialOrderListLength: 0,
    selectedIndex: 0,
  });

  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const isOpen = useSharedValue(false);
  const isLogoutConfirmOpen = useSharedValue(false);
  const { fetchData } = useFetchData();
  const orderList = useAppStore((state) => state.orderList);
  const addItem = useAppStore((state) => state.addItem);
  const increaseQuantity = useAppStore((state) => state.increaseItemQuantity);
  const removeItem = useAppStore((state) => state.removeItem);
  const removeOrder = useAppStore((state) => state.removeOrder);
  const removeAllItems = useAppStore((state) => state.removeAllItems);
  const clearOrders = useAppStore((state) => state.clearOrders);
  const waiterList = useAppStore((state) => state.waiters);
  const selectedWaiter = useAppStore((state) => state.waiter);
  const setWaiter = useAppStore((state) => state.setWaiter);
  const setTable = useAppStore((state) => state.setTable);
  const dbData = useAppStore((state) => state.dbData);
  const setDbData = useAppStore((state) => state.setDbData);
  const selectedTable = useAppStore((state) => state.table);

  const [selectedIndex, setSelectedIndex] = useState(0);

  React.useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const toggleSheet = () => {
    Keyboard.dismiss();
    if (isOpen.value) {
      setSelectedItemForEdit(null);
    }
    isOpen.value = !isOpen.value;
  };

  const toggleSideMenu = () => {
    showMenu(!isMenuShown);
  };

  const DEFAULT_PRINTER_IP = "192.168.1.126";
  const printerPort = 9100;

  const isProductObject = (x) =>
    x &&
    typeof x === "object" &&
    x?.itemName != null &&
    (x?.itemID != null || x?.itemId != null);

  const normalizePrinterGroups = (apiResponse) => {
    // DO NOT regroup by printerName because backend is already grouped by kitchen/printer.
    // We convert each already-grouped "kitchen items array" into a print job.
    const data = apiResponse?.data ?? apiResponse;

    const looksLikeProductsArray = (x) =>
      Array.isArray(x) && (x.length === 0 || isProductObject(x[0]));
    const looksLikeGroupsArray = (x) =>
      Array.isArray(x) && x.every((g) => looksLikeProductsArray(g));

    const level0 = Array.isArray(data) ? data : [];

    // Try to locate the level that contains "kitchen item arrays".
    let groupsLevel = null;

    // Case A: data = [ kitchenItems1[], kitchenItems2[], ... ]
    if (looksLikeGroupsArray(level0)) {
      groupsLevel = level0;
    }

    // Case B: data = [ [ kitchenItems1[], kitchenItems2[], ... ] ]
    if (!groupsLevel && Array.isArray(level0) && level0.length === 1) {
      if (looksLikeGroupsArray(level0[0])) {
        groupsLevel = level0[0];
      }
    }

    // Case C: data = [ product, product, ... ] (single kitchen)
    if (!groupsLevel && looksLikeProductsArray(level0)) {
      groupsLevel = [level0];
    }

    // Case D: data = [ products[] ] (single kitchen nested)
    if (
      !groupsLevel &&
      level0.length > 0 &&
      looksLikeProductsArray(level0[0])
    ) {
      groupsLevel = [level0[0]];
    }

    if (!groupsLevel || groupsLevel.length === 0) return [];

    return groupsLevel
      .map((items, idx) => {
        const filtered = Array.isArray(items)
          ? items.filter(isProductObject)
          : [];
        if (filtered.length === 0) return null;

        const printerName = filtered[0]?.printerName || DEFAULT_PRINTER_IP;
        return {
          groupId: String(idx),
          printerName,
          items: filtered,
        };
      })
      .filter(Boolean);
  };

  const updateJob = (groupId, patch) => {
    setPrinterJobs((prev) =>
      prev.map((job) => (job.groupId === groupId ? { ...job, ...patch } : job)),
    );
  };

  const checkPrinterConnection = async (printerName) => {
    const host = printerName || DEFAULT_PRINTER_IP;

    return await new Promise((resolve) => {
      let resolved = false;
      const TIMEOUT_MS = 3000;
      const TIMEOUT_ERROR_MESSAGE =
        "Connection issue: printer not reachable (timeout).";
      const socket = TcpSocket.createConnection({
        host,
        port: printerPort,
        timeout: TIMEOUT_MS,
      });
      const timeoutHandle = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        socket.end();
        resolve({ ok: false, error: TIMEOUT_ERROR_MESSAGE });
      }, TIMEOUT_MS + 500);

      const resolveOnce = (payload) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutHandle);
        resolve(payload);
      };

      socket.on("connect", () => {
        socket.end();
        resolveOnce({ ok: true });
      });

      socket.on("error", (err) => {
        socket.end();
        resolveOnce({
          ok: false,
          error: String(err?.message ?? err ?? "Connection failed"),
        });
      });

      socket.on("close", () => {
        resolveOnce({ ok: false, error: "Connection closed" });
      });

      socket.on("timeout", () => {
        socket.end();
        resolveOnce({ ok: false, error: TIMEOUT_ERROR_MESSAGE });
      });
    });
  };

  const finalizeIfAllPrinted = () => {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;

    setModalVisible(false);
    setShowRightDrawer(false);
    removeOrder(finalizeMetaRef.current.selectedIndex);

    if (finalizeMetaRef.current.initialOrderListLength === 1) {
      setTable(null);
      navigation.navigate("table");
    }
  };

  const handleRetryPrinter = async (groupId) => {
    if (hasFinalizedRef.current) return;

    const group = printerGroups.find((g) => g.groupId === groupId);
    if (!group) return;

    updateJob(groupId, {
      status: "checking",
      message: "Retrying connection...",
      error: "",
    });

    const conn = await checkPrinterConnection(group.printerName);
    if (!conn.ok) {
      updateJob(groupId, {
        status: "failed",
        message: "",
        error: conn.error || "Connection failed",
      });
      return;
    }

    updateJob(groupId, {
      status: "connected",
      message: "Connected",
      error: "",
    });

    updateJob(groupId, {
      status: "printing",
      message: "Printing...",
      error: "",
    });

    try {
      await printToPrinter({
        printerName: group.printerName,
        orderItems: group.items,
      });

      setPrinterJobs((prev) => {
        const updated = prev.map((job) =>
          job.groupId === groupId
            ? { ...job, status: "printed", message: "Printed", error: "" }
            : job,
        );
        const allOk =
          updated.length > 0 &&
          updated.every((job) => job.status === "printed");
        if (allOk) finalizeIfAllPrinted();
        return updated;
      });
    } catch (err) {
      updateJob(groupId, {
        status: "failed",
        message: "",
        error: String(err?.message ?? err ?? "Print failed"),
      });
    }
  };

  const handlePrintButtonPress = async () => {
    if (isPrinting) return;

    const currentOrder = orderList[selectedIndex];
    if (!currentOrder) return;

    const initialOrderListLength = orderList.length;
    finalizeMetaRef.current = { initialOrderListLength, selectedIndex };

    const body = {
      id: currentOrder.table.transactionID ?? null,
      date: new Date().toISOString(),
      items: currentOrder.items,
    };

    const chairName = currentOrder.table.chairName ?? "0";

    const respData = await fetchData(
      `api/v1/restaurent/svprintKot?sectionId=${currentOrder.section.id}&tableId=${currentOrder.table.id}&tableName=${currentOrder.table.tableName}&salesManId=${selectedWaiter.id}&chairName=${chairName}`,
      "post",
      body,
    );
    if (!respData) return;

    const groups = normalizePrinterGroups(respData);
    if (groups.length === 0) return;

    setPrinterGroups(groups);
    setPrinterJobs(
      groups.map((g) => ({
        groupId: g.groupId,
        printerName: g.printerName,
        status: "pending",
        message: "Queued",
        error: "",
      })),
    );
    setModalVisible(true);

    setIsPrinting(true);
    hasFinalizedRef.current = false;

    const successMap = new Map(groups.map((g) => [g.groupId, false]));

    for (const group of groups) {
      updateJob(group.groupId, {
        status: "checking",
        message: "Checking connection...",
        error: "",
      });

      const conn = await checkPrinterConnection(group.printerName);
      if (!conn.ok) {
        successMap.set(group.groupId, false);
        updateJob(group.groupId, {
          status: "failed",
          message: "",
          error: conn.error || "Connection failed",
        });
        continue;
      }

      updateJob(group.groupId, {
        status: "connected",
        message: "Connected",
        error: "",
      });

      updateJob(group.groupId, {
        status: "printing",
        message: "Printing...",
        error: "",
      });

      try {
        await printToPrinter({
          printerName: group.printerName,
          orderItems: group.items,
        });
        successMap.set(group.groupId, true);
        updateJob(group.groupId, {
          status: "printed",
          message: "Printed",
          error: "",
        });
      } catch (err) {
        successMap.set(group.groupId, false);
        updateJob(group.groupId, {
          status: "failed",
          message: "",
          error: String(err?.message ?? err ?? "Print failed"),
        });
      }
    }

    setIsPrinting(false);

    const allOk = groups.every((g) => successMap.get(g.groupId));
    if (allOk) finalizeIfAllPrinted();
  };

  const handleClosePrinterStatus = () => {
    if (orderList[selectedIndex]) {
      removeAllItems(selectedIndex);
      removeOrder(selectedIndex);
    }
    setTable(null);
    setPrinterJobs([]);
    setPrinterGroups([]);
    setModalVisible(false);
    if (orderList.length <= 1) {
      navigation.navigate("table");
    }
  };

  useEffect(() => {
    setIsLoading(true);

    let filteredItems = foodItems;

    if (selectedCategory !== 1) {
      filteredItems = filteredItems?.filter(
        (item) => item.items.commodityID === selectedCategory,
      );
    }

    if (searchQuery) {
      filteredItems = filteredItems?.filter((item) =>
        item?.items?.itemName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredFoodItems(filteredItems);

    setTimeout(() => {
      setIsLoading(false);
    }, 30);
  }, [selectedCategory, foodItems, searchQuery]);

  useEffect(() => {
    const getCategoryList = async () => {
      const respData = await fetchData("api/v1/restaurent/getCat");
      if (respData) {
        setCategories([
          { id: 1, code: 1, description: "All" },
          ...respData.data,
        ]);
      }
    };
    const getItemsList = async () => {
      const respData = await fetchData("api/v1/restaurent/fillitems");
      if (respData?.data?.product) {
        setFoodItems(respData.data.product);
      }
    };

    getCategoryList();
    getItemsList();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (selectedCategory === 1) {
      setFilteredFoodItems(foodItems);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      const filteredItems = foodItems?.filter(
        (item) => item.items.commodityID === selectedCategory,
      );
      setFilteredFoodItems(filteredItems);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!selectedTable || orderList.length === 0) return;

    const matchedOrderIndex = orderList.findIndex(
      (order) =>
        order?.table?.id === selectedTable?.id &&
        (order?.table?.chairName ?? "") === (selectedTable?.chairName ?? ""),
    );

    if (matchedOrderIndex >= 0) {
      setSelectedIndex(matchedOrderIndex);
    }
  }, [selectedTable, orderList]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (menuItem) => {
    if (showRightDrawer) {
      setShowRightDrawer(false);
    } else {
      const transformedItem = createPostOrderItem(menuItem);
      const itemHasMoreUnits = menuItem?.itemUnits?.length > 1;

      const uniqueId =
        menuItem.items?.id + menuItem.items?.unit + menuItem.items?.rate;

      const existingItem = orderList[selectedIndex].items?.find(
        (item) => item.uuid === uniqueId,
      );

      const formatedData = {
        uuid: uniqueId,
        id: menuItem.items?.id,
        itemUnits: menuItem.itemUnits,
        itemOptions: menuItem.itemOptions,
        ...transformedItem,
      };

      if (itemHasMoreUnits) {
        setSelectedItemForEdit(formatedData);
        toggleSheet();
      } else if (existingItem) {
        increaseQuantity(selectedIndex, formatedData.uuid);
      } else {
        addItem(selectedIndex, formatedData);
      }
    }
  };

  const removeItemFromOrder = (item) => {
    removeItem(selectedIndex, item.uuid);
  };

  const handleLogout = () => {
    showMenu(false);
    isLogoutConfirmOpen.value = true;
  };

  const handleConfirmLogout = () => {
    isLogoutConfirmOpen.value = false;
    // Local logout only: clear auth fields and return to login.
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
        <AppBar
          showSearch={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleSideMenu={toggleSideMenu}
        />
        <SideMenu
          isVisible={isMenuShown}
          onLogout={handleLogout}
          waiterList={waiterList}
          setWaiter={setWaiter}
          selectedWaiter={selectedWaiter}
        />
        <View style={styles.mainFlexView}>
          <MenuList
            isLoading={isLoading}
            filteredFoodItems={filteredFoodItems}
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryFilter={handleCategoryFilter}
            addToCart={addToCart}
            onOverlayPress={() => {
              if (showRightDrawer) {
                setShowRightDrawer(false);
              }
            }}
            footerSection={
              <OrderTableList
                tableList={orderList}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            }
          />
          {!isLandscape && (
            <AnimatedButton
              showRightDrawer={showRightDrawer}
              onPress={() => setShowRightDrawer(!showRightDrawer)}
            />
          )}
          <OrderList
            isLandscape={isLandscape}
            selectedIndex={selectedIndex}
            showRightDrawer={showRightDrawer}
            handlePrintButtonPress={handlePrintButtonPress}
            orderedItems={orderList[selectedIndex]}
            setSelectedItemForEdit={setSelectedItemForEdit}
            toggleSheet={toggleSheet}
          />
        </View>
        {!isLandscape &&
          !showRightDrawer &&
          orderList[selectedIndex]?.items.length > 0 && (
            <CurrentOrderItem
              orderedItems={orderList[selectedIndex].items}
              selectedIndex={selectedIndex}
              removeItem={removeItemFromOrder}
            />
          )}
        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          visible={isModalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Printer Status</Text>

              <ScrollView style={styles.printerList}>
                {printerJobs.map((job) => (
                  <View key={job.groupId} style={styles.printerRow}>
                    <View style={styles.printerRowHeader}>
                      <Text style={styles.printerName}>{job.printerName}</Text>
                      <Text style={styles.printerStatus}>{job.status}</Text>
                    </View>

                    {!!job.message && (
                      <Text style={styles.printerMessage}>{job.message}</Text>
                    )}
                    {!!job.error && (
                      <Text style={styles.printerError}>{job.error}</Text>
                    )}

                    {job.status === "failed" && (
                      <TouchableOpacity
                        style={styles.retryButton}
                        activeOpacity={0.8}
                        onPress={() => handleRetryPrinter(job.groupId)}
                      >
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.8}
                onPress={handleClosePrinterStatus}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <OrderUpdate
          isOpen={isOpen}
          toggleSheet={toggleSheet}
          item={selectedItemForEdit}
          selectedIndex={selectedIndex}
          removeItemFromOrder={removeItemFromOrder}
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

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: Theme.colors.background.accents.white,
  },
  mainFlexView: {
    flex: 1,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: Theme.typography.fontSize[16],
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 10,
    textAlign: "center",
  },
  printerList: {
    flexGrow: 0,
    maxHeight: 360,
    marginBottom: 12,
  },
  printerRow: {
    borderWidth: 1,
    borderColor: Theme.colors.stroke.secondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: Theme.colors.background.accents.white,
  },
  printerRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  printerName: {
    flex: 1,
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
    marginRight: 10,
  },
  printerStatus: {
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
    textTransform: "capitalize",
  },
  printerMessage: {
    marginTop: 8,
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.secondary.default,
  },
  printerError: {
    marginTop: 6,
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.accents.red,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: Theme.colors.background.primary.default,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.secondary.default,
  },
  closeButton: {
    backgroundColor: Theme.colors.background.primary.muted,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.primary.default,
  },
});
