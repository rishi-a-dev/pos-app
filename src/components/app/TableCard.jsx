import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import Theme from "../../theme/Theme";

export const TableCard = ({
  table,
  selectedTable,
  handleTable,
  handleLongPress,
}) => (
  <TouchableOpacity
    style={[
      styles.tableCard,
      {
        backgroundColor:
          selectedTable?.id === table.id &&
          selectedTable?.chairName === table.chairName
            ? Theme.colors.background.primary.default
            : Theme.colors.background.primary.muted,
      },
    ]}
    onPress={() => handleTable(table)}
    delayLongPress={500}
    onLongPress={() => handleLongPress(table)}
  >
    <Text
      style={[
        Theme.typography.H5,
        {
          color:
            selectedTable?.id === table.id &&
            selectedTable?.chairName === table.chairName
              ? Theme.colors.text.secondary.default
              : Theme.colors.text.primary.default,
        },
      ]}
    >
      Table {table.tableName} {table.chairName && `- ${table.chairName}`}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tableCard: {
    width: 172,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
  },
});
