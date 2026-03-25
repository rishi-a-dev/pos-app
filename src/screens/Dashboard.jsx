import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import Theme from "../theme/Theme";
import { useAppStore } from "../stores";
import { AppBar } from "../components/app/AppBar";
import { connectToPrinter } from "../components/utils/Printer";
import { MenuList } from "../components/app/MenuList";
import { OrderList } from "../components/app/OrderList";
import { PrinterStatus } from "../components/app/PrinterStatus";
import { CurrentOrderItem } from "../components/app/CurrentOrderItem";
import { SideMenu } from "../components/app/SideMenu";
import { useOrientation } from "../components/context/OrientationContext";
import { AnimatedButton } from "../components/app/AnimatedButton";
import OrderUpdate from "../components/app/OrderUpdate";
import { useFetchData } from "../components/hooks/useFetchData";
import { OrderTableList } from "../components/app/OrderTableList";
import { createPostOrderItem } from "../components/utils/PostOrderItemStructure";

const Dashboard = () => {
  const navigation = useNavigation();
  const isLandscape = useOrientation();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [printStatus, setPrintStatus] = useState("");
  const [isMenuShown, showMenu] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const isOpen = useSharedValue(false);
  const { fetchData } = useFetchData();
  const orderList = useAppStore((state) => state.orderList);
  const addItem = useAppStore((state) => state.addItem);
  const increaseQuantity = useAppStore((state) => state.increaseItemQuantity);
  const removeItem = useAppStore((state) => state.removeItem);
  const removeOrder = useAppStore((state) => state.removeOrder);
  const waiterList = useAppStore((state) => state.waiters);
  const selectedWaiter = useAppStore((state) => state.waiter);
  const setWaiter = useAppStore((state) => state.setWaiter);
  const setTable = useAppStore((state) => state.setTable);

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

  function printCallback(success) {
    if (success) {
      setPrintStatus("success");
    } else {
      setPrintStatus("failed");
    }
  }

  const handlePrintButtonPress = async () => {
    const body = {
      id: null,
      date: new Date().toISOString(),
      items: orderList[selectedIndex].items,
    };

    const respData = await fetchData(
      `api/v1/restaurent/svprintKot?sectionId=${orderList[selectedIndex].section.id}&tableId=${orderList[selectedIndex].table.id}&tableName=${orderList[selectedIndex].table.tableName}&salesManId=${selectedWaiter.id}`,
      "post",
      body,
    );
    if (respData) {
      console.log("respData", JSON.stringify(respData));
      if (selectedIndex >= 0 && selectedIndex < orderList.length) {
        setModalVisible(!isModalVisible);
        connectToPrinter(
          setPrinterConnected,
          setConnectionMessage,
          setErrorMessage,
          printCallback,
          respData,
          () => {
            setShowRightDrawer(false);
            removeOrder(selectedIndex);
            if (orderList.length === 1) {
              setTable(null);
              navigation.navigate("table");
            }
          },
        );
      }
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
        <PrinterStatus
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          printStatus={printStatus}
          connectionMessage={connectionMessage}
          errorMessage={errorMessage}
        />
        <OrderUpdate
          isOpen={isOpen}
          toggleSheet={toggleSheet}
          item={selectedItemForEdit}
          selectedIndex={selectedIndex}
          removeItemFromOrder={removeItemFromOrder}
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
});
