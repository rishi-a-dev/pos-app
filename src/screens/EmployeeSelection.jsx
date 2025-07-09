import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Theme from "../theme/Theme";
import { useAppStore } from "../stores";
import { useFetchData } from "../components/hooks/useFetchData";
import ProfileCard from "../components/app/ProfileCard";

const EmployeeSelection = () => {
  const navigation = useNavigation();
  const { fetchData } = useFetchData();
  const waiterList = useAppStore((state) => state.waiters);
  const setWaiterList = useAppStore((state) => state.setWaitersList);
  const selectedWaiter = useAppStore((state) => state.waiter);
  const setWaiter = useAppStore((state) => state.setWaiter);

  const getWaiterList = async () => {
    const respData = await fetchData("api/v1/restaurent/getWaiter");
    if (respData) {
      setWaiterList(respData.data);
    }
  };

  useEffect(() => {
    getWaiterList();
  }, []);

  const handleSelectWaiter = (waiter) => {
    setWaiter(waiter);
    navigation.navigate("drawer", { screen: "table" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <Text style={styles.appbarHeader}>Select Employee</Text>
      </View>
      {waiterList.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No employees found.</Text>
          <Text style={styles.emptyText}>Please add employee to continue.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {waiterList.map((waiter) => (
            <ProfileCard
              key={waiter.id}
              waiter={waiter}
              selectedWaiter={selectedWaiter}
              onSelectWaiter={handleSelectWaiter}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default EmployeeSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  appbar: {
    width: "100%",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderBottomWidth: Theme.border.width.normal,
    borderBottomColor: Theme.colors.stroke.secondary,
  },
  appbarHeader: {
    textAlign: "left",
    ...Theme.typography.H2,
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
  contentContainer: {
    flex: 1,
    width: "100%",
    padding: "4%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
});
