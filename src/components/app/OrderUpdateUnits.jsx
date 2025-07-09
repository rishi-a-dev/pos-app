import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Theme from "../../theme/Theme";

export const OrderUpdateUnits = ({
  item,
  updateSelectedItem,
  setUpdateSelectedItem,
}) => {
  return (
    item?.itemUnits.length > 1 && (
      <View style={styles.row}>
        <View style={styles.unitContainer}>
          <Text style={styles.unitTitle}>Change Unit</Text>
          <Text style={styles.unitSubtitle}>Select any 1 option</Text>
          <View style={styles.unitRow}>
            <FlatList
              data={item.itemUnits}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item: itemUnit }) => (
                <TouchableOpacity
                  onPress={() =>
                    setUpdateSelectedItem((prev) => ({
                      ...prev,
                      unit: {
                        unit: itemUnit?.unit,
                        basicUnit: itemUnit?.basicUnit,
                        factor: itemUnit?.factor,
                      },
                    }))
                  }
                  style={[
                    styles.unitBox,
                    {
                      backgroundColor:
                        updateSelectedItem.unit?.unit === itemUnit.unit
                          ? Theme.colors.background.primary.default
                          : Theme.colors.transparent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      Theme.typography.H5,
                      {
                        color:
                          updateSelectedItem.unit?.unit === itemUnit.unit
                            ? Theme.colors.text.secondary.default
                            : Theme.colors.text.primary.default,
                      },
                    ]}
                  >
                    {itemUnit.unit}
                  </Text>
                  <Text
                    style={[
                      Theme.typography.H5,
                      {
                        color:
                          updateSelectedItem.unit?.unit === itemUnit.unit
                            ? Theme.colors.text.secondary.default
                            : Theme.colors.text.primary.default,
                      },
                    ]}
                  >
                    ₹
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  unitContainer: {
    flex: 1,
    height: "100%",
    borderRadius: Theme.border.radius.small,
    backgroundColor: Theme.colors.background.primary.disabled,
    padding: 8,
  },
  unitTitle: {
    ...Theme.typography.H3,
  },
  unitSubtitle: {
    ...Theme.typography.H5,
    color: Theme.colors.text.primary.disabled,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListContent: {
    paddingRight: "3%",
    paddingTop: "1%",
  },
  unitBox: {
    width: 70,
    height: 70,
    borderRadius: Theme.border.radius.small,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    paddingHorizontal: 4,
  },
});
