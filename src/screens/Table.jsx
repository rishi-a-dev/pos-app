import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import Theme from "../theme/Theme";
import { useAppStore } from "../stores";
import { AppBar } from "../components/app/AppBar";
import { useFetchData } from "../components/hooks/useFetchData";
import { OrderItemList } from "../components/app/OrderItemList";
import { useOrientation } from "../components/context/OrientationContext";
import { TableCard } from "../components/app/TableCard";
import { SectionButton } from "../components/app/SectionButton";
import TableAdditionalPopup from "../components/app/TableAdditionalPopup";

const Table = () => {
  const [orderList, setOrderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tableAdditionalPopup, setTableAdditionalPopup] = useState(false);

  const sectionList = useAppStore((state) => state.sections);
  const setSectionList = useAppStore((state) => state.setSectionsList);
  const tableList = useAppStore((state) => state.tables);
  const setTableList = useAppStore((state) => state.setTablesList);
  const selectedSection = useAppStore((state) => state.section);
  const selectedTable = useAppStore((state) => state.table);
  const setSection = useAppStore((state) => state.setSection);
  const setTable = useAppStore((state) => state.setTable);
  const addNewOrder = useAppStore((state) => state.addNewOrder);

  const navigation = useNavigation();
  const isLandscape = useOrientation();
  const { fetchData } = useFetchData();

  const getTableList = async (id) => {
    const respData = await fetchData(
      `api/v1/restaurent/fillTable?sectionId=${id}`
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
    if (table.id === selectedTable?.id) {
      setTableAdditionalPopup(true);
    } else {
      handleOrders(table);
    }
  };

  const handleOrders = (table) => {
    setTable(table);
    const newOrder = {
      section: selectedSection,
      table: table,
      items: [],
    };

    addNewOrder(newOrder);
    setTableAdditionalPopup(false);
    navigation.navigate("dashboard");
  };

  const handleLongPress = async (table) => {
    const respData = await fetchData(
      `api/v1/restaurent/getItem?transId=${table.transactionID}`
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

  return (
    <View style={styles.container}>
      <AppBar />
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
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No tables found.</Text>
          <Text style={styles.emptyText}>
            Please choose a section to continue.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {tableList?.map((table, index) => (
            <TableCard
              key={index.toString()}
              table={table}
              selectedTable={selectedTable}
              handleTable={handleTable}
              handleLongPress={handleLongPress}
            />
          ))}
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
    </View>
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
